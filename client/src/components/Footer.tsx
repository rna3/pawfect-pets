import { footerStyles } from '../styles/Footer.styles';

const Footer = () => {
  return (
    <footer className={footerStyles.footer}>
      <div className={footerStyles.container}>
        <div className={footerStyles.grid}>
          <div>
            <h3 className={footerStyles.sectionTitle}>🐾 Pawfect Pets</h3>
            <p className={footerStyles.text}>
              Your one-stop shop for all your dog's needs. Quality services for happy, healthy pets.
            </p>
          </div>
          <div>
            <h4 className={footerStyles.sectionSubtitle}>Quick Links</h4>
            <ul className={footerStyles.linkList}>
              <li><a href="/" className={footerStyles.link}>Home</a></li>
              <li><a href="/services" className={footerStyles.link}>Services</a></li>
            </ul>
          </div>
          <div>
            <h4 className={footerStyles.sectionSubtitle}>Contact</h4>
            <p className={footerStyles.text}>
              Email: info@pawfectpets.com<br />
              Phone: (555) 123-4567
            </p>
          </div>
        </div>
        <div className={footerStyles.divider}>
          <p>&copy; 2024 Pawfect Pets. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

