import crypto from 'crypto';
import express, { Response } from 'express';
import Service from '../models/Service';

const router = express.Router();

type BusyRange = {
  start: string;
  end: string;
};

const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const FREE_BUSY_URL = 'https://www.googleapis.com/calendar/v3/freeBusy';

const toDateTime = (date: string, time: string): Date => new Date(`${date}T${time}:00`);

const getDaysBetween = (from: Date, to: Date): Date[] => {
  const days: Date[] = [];
  const current = new Date(from);
  current.setHours(0, 0, 0, 0);
  const end = new Date(to);
  end.setHours(0, 0, 0, 0);

  while (current <= end) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return days;
};

const formatDate = (date: Date): string => date.toISOString().slice(0, 10);

const isOverlapping = (start: Date, end: Date, busy: BusyRange[]): boolean =>
  busy.some((range) => {
    const busyStart = new Date(range.start);
    const busyEnd = new Date(range.end);
    return start < busyEnd && end > busyStart;
  });

const getGoogleAccessToken = async (): Promise<string> => {
  const serviceEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKeyRaw = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;

  if (!serviceEmail || !privateKeyRaw) {
    throw new Error(
      'Google Calendar not configured. Set GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.'
    );
  }

  const privateKey = privateKeyRaw.replace(/\\n/g, '\n');
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const payload = {
    iss: serviceEmail,
    scope: 'https://www.googleapis.com/auth/calendar.readonly',
    aud: TOKEN_URL,
    exp: now + 3600,
    iat: now,
  };

  const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const dataToSign = `${encodedHeader}.${encodedPayload}`;
  const signature = crypto
    .createSign('RSA-SHA256')
    .update(dataToSign)
    .sign(privateKey, 'base64url');
  const assertion = `${dataToSign}.${signature}`;

  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Google token request failed: ${errorBody}`);
  }

  const tokenData = (await response.json()) as { access_token?: string };
  if (!tokenData.access_token) {
    throw new Error('Google token response missing access_token');
  }
  return tokenData.access_token as string;
};

router.get('/availability', async (req: express.Request, res: Response): Promise<void> => {
  try {
    const serviceId = Number(req.query.serviceId);
    const from = String(req.query.from || '');
    const to = String(req.query.to || '');
    const calendarId = process.env.GOOGLE_CALENDAR_ID;
    const timezone = process.env.BOOKING_TIMEZONE || 'America/New_York';
    const businessHoursStart = process.env.BOOKING_DAY_START || '09:00';
    const businessHoursEnd = process.env.BOOKING_DAY_END || '17:00';
    const slotStepMinutes = Number(process.env.BOOKING_SLOT_INTERVAL_MINUTES || 30);

    if (!serviceId || !from || !to) {
      res.status(400).json({ error: 'serviceId, from, and to are required' });
      return;
    }

    if (!calendarId) {
      res.status(500).json({
        error: 'GOOGLE_CALENDAR_ID is not configured.',
      });
      return;
    }

    const service = await Service.findByPk(serviceId);
    if (!service) {
      res.status(404).json({ error: 'Service not found' });
      return;
    }

    const fromDate = new Date(`${from}T00:00:00`);
    const toDate = new Date(`${to}T23:59:59`);
    if (Number.isNaN(fromDate.getTime()) || Number.isNaN(toDate.getTime())) {
      res.status(400).json({ error: 'Invalid from/to date values' });
      return;
    }

    const accessToken = await getGoogleAccessToken();
    const freeBusyResponse = await fetch(FREE_BUSY_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        timeMin: fromDate.toISOString(),
        timeMax: toDate.toISOString(),
        timeZone: timezone,
        items: [{ id: calendarId }],
      }),
    });

    if (!freeBusyResponse.ok) {
      const errorBody = await freeBusyResponse.text();
      throw new Error(`Google freeBusy request failed: ${errorBody}`);
    }

    const freeBusyData = (await freeBusyResponse.json()) as {
      calendars?: Record<string, { busy?: BusyRange[] }>;
    };
    const busyRanges: BusyRange[] = freeBusyData.calendars?.[calendarId]?.busy || [];
    const serviceMinutes = Number(service.duration);
    const slots: Array<{ start: string; end: string; date: string; time: string }> = [];

    const days = getDaysBetween(fromDate, toDate);
    for (const day of days) {
      const dateStr = formatDate(day);
      let slotStart = toDateTime(dateStr, businessHoursStart);
      const dayEnd = toDateTime(dateStr, businessHoursEnd);

      while (slotStart < dayEnd) {
        const slotEnd = new Date(slotStart.getTime() + serviceMinutes * 60_000);
        if (slotEnd > dayEnd) break;

        const slotInPast = slotStart <= new Date();
        const hasConflict = isOverlapping(slotStart, slotEnd, busyRanges);
        if (!slotInPast && !hasConflict) {
          slots.push({
            start: slotStart.toISOString(),
            end: slotEnd.toISOString(),
            date: dateStr,
            time: slotStart.toTimeString().slice(0, 5),
          });
        }

        slotStart = new Date(slotStart.getTime() + slotStepMinutes * 60_000);
      }
    }

    const calendarEmbedUrl =
      `https://calendar.google.com/calendar/embed?src=${encodeURIComponent(calendarId)}` +
      `&ctz=${encodeURIComponent(timezone)}&mode=WEEK`;

    res.json({
      timezone,
      calendarEmbedUrl,
      slots,
    });
  } catch (error: any) {
    console.error('Get calendar availability error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch calendar availability' });
  }
});

export default router;
