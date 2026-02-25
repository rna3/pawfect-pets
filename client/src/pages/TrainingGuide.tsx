import { useState } from 'react';
import { generateTrainingGuide } from '../utils/api';
import { toast } from 'react-toastify';
import { trainingGuideStyles } from '../styles/TrainingGuide.styles';
import {
  PetProfile,
  EnergyLevel,
  Environment,
  ExperienceLevel,
} from '../types';

// Dropdown options for quick selection
const AGE_OPTIONS = [
  { value: 3, label: '3 months' },
  { value: 6, label: '6 months' },
  { value: 9, label: '9 months' },
  { value: 12, label: '1 year' },
  { value: 18, label: '18 months' },
  { value: 24, label: '2 years' },
  { value: 36, label: '3 years' },
  { value: 48, label: '4 years' },
  { value: 60, label: '5 years' },
  { value: 84, label: '7 years' },
  { value: 120, label: '10+ years' },
];

const BREED_OPTIONS = [
  'Labrador Retriever', 'Golden Retriever', 'German Shepherd', 'French Bulldog',
  'Bulldog', 'Poodle', 'Beagle', 'Rottweiler', 'Yorkshire Terrier', 'Boxer',
  'Dachshund', 'Shih Tzu', 'Australian Shepherd', 'Siberian Husky', 'Cavalier King Charles Spaniel',
  'Doberman Pinscher', 'Miniature Schnauzer', 'Pomeranian', 'Chihuahua', 'Maltese',
  'Cocker Spaniel', 'Border Collie', 'Boston Terrier', 'Havanese', 'Shetland Sheepdog',
  'Mixed breed', 'Other',
];

const TRAINING_GOAL_OPTIONS = [
  'Sit', 'Stay', 'Come when called', 'Loose leash walking', 'Crate training',
  'Potty training', 'Leave it', 'Drop it', 'Heel', 'Down', 'Recall (off-leash)',
  'Not jumping on people', 'Settle / calm behavior', 'Place command', 'Wait at doors',
  'Basic obedience', 'Trick training', 'Other',
];

const BEHAVIOR_ISSUE_OPTIONS = [
  'Jumping on people', 'Pulling on leash', 'Barking', 'Chewing', 'Separation anxiety',
  'Digging', 'Counter surfing', 'Nipping / mouthing', 'Reactivity to other dogs',
  'Reactivity to people', 'Fear or shyness', 'Resource guarding', 'House soiling',
  'None', 'Other',
];

const TrainingGuide = () => {
  const [formData, setFormData] = useState<Partial<PetProfile>>({
    name: '',
    ageMonths: 12,
    breed: '',
    energyLevel: 'medium',
    environment: 'house',
    experienceLevel: 'none',
    trainingGoals: [],
    behaviorIssues: [],
    healthNotes: '',
  });
  const [selectedBreedDropdown, setSelectedBreedDropdown] = useState<string>('');
  const [breedOtherText, setBreedOtherText] = useState('');
  const [selectedGoal, setSelectedGoal] = useState('');
  const [selectedBehaviorIssue, setSelectedBehaviorIssue] = useState('');
  const [loading, setLoading] = useState(false);
  const [guide, setGuide] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBreedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedBreedDropdown(value);
    if (value === 'Other') {
      setFormData((prev) => ({ ...prev, breed: breedOtherText.trim() || undefined }));
    } else {
      setFormData((prev) => ({ ...prev, breed: value || undefined }));
      setBreedOtherText('');
    }
  };

  const handleBreedOtherChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setBreedOtherText(value);
    setFormData((prev) => ({ ...prev, breed: value.trim() || undefined }));
  };

  const handleAddGoal = () => {
    if (selectedGoal && !formData.trainingGoals?.includes(selectedGoal)) {
      setFormData((prev) => ({
        ...prev,
        trainingGoals: [...(prev.trainingGoals || []), selectedGoal],
      }));
      setSelectedGoal('');
    }
  };

  const handleRemoveGoal = (goal: string) => {
    setFormData((prev) => ({
      ...prev,
      trainingGoals: prev.trainingGoals?.filter((g) => g !== goal) || [],
    }));
  };

  const handleAddBehaviorIssue = () => {
    if (!selectedBehaviorIssue) return;
    const issue = selectedBehaviorIssue === 'None' ? '' : selectedBehaviorIssue;
    if (issue && !formData.behaviorIssues?.includes(issue)) {
      setFormData((prev) => ({
        ...prev,
        behaviorIssues: [...(prev.behaviorIssues || []), issue],
      }));
    }
    setSelectedBehaviorIssue('');
  };

  const handleRemoveBehaviorIssue = (issue: string) => {
    setFormData((prev) => ({
      ...prev,
      behaviorIssues: prev.behaviorIssues?.filter((b) => b !== issue) || [],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setGuide(null);

    // Validation
    if (!formData.name?.trim()) {
      toast.error('Please enter your pet\'s name');
      return;
    }

    if (!formData.ageMonths || formData.ageMonths < 1) {
      toast.error('Please enter a valid age');
      return;
    }

    if (!formData.trainingGoals || formData.trainingGoals.length === 0) {
      toast.error('Please add at least one training goal');
      return;
    }

    setLoading(true);
    try {
      const response = await generateTrainingGuide(formData as PetProfile);
      setGuide(response.data.guide);
      toast.success('Training guide generated successfully!');
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error || 'Failed to generate training guide. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={trainingGuideStyles.container}>
      <h1 className={trainingGuideStyles.title}>Personalized Dog Training Guide</h1>
      <p className={trainingGuideStyles.subtitle}>
        Get a customized positive reinforcement training plan tailored to your dog's needs
      </p>

      {!guide ? (
        <form onSubmit={handleSubmit} className={trainingGuideStyles.formContainer}>
          <h2 className={trainingGuideStyles.formTitle}>Pet Profile</h2>

          <div className={trainingGuideStyles.formGrid}>
            {/* Name */}
            <div>
              <label className={trainingGuideStyles.label}>
                Pet Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={trainingGuideStyles.input}
                required
              />
            </div>

            {/* Age */}
            <div>
              <label className={trainingGuideStyles.label}>
                Age <span className="text-red-500">*</span>
              </label>
              <select
                name="ageMonths"
                value={formData.ageMonths}
                onChange={handleInputChange}
                className={trainingGuideStyles.select}
                required
              >
                {AGE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Breed */}
            <div>
              <label className={trainingGuideStyles.label}>Breed (optional)</label>
              <select
                value={selectedBreedDropdown}
                onChange={handleBreedChange}
                className={trainingGuideStyles.select}
              >
                <option value="">Select breed</option>
                {BREED_OPTIONS.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
              {selectedBreedDropdown === 'Other' && (
                <input
                  type="text"
                  value={breedOtherText}
                  onChange={handleBreedOtherChange}
                  className={`${trainingGuideStyles.input} mt-2`}
                  placeholder="Specify breed"
                />
              )}
            </div>

            {/* Energy Level */}
            <div>
              <label className={trainingGuideStyles.label}>
                Energy Level <span className="text-red-500">*</span>
              </label>
              <select
                name="energyLevel"
                value={formData.energyLevel}
                onChange={handleInputChange}
                className={trainingGuideStyles.select}
                required
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            {/* Environment */}
            <div>
              <label className={trainingGuideStyles.label}>
                Living Environment <span className="text-red-500">*</span>
              </label>
              <select
                name="environment"
                value={formData.environment}
                onChange={handleInputChange}
                className={trainingGuideStyles.select}
                required
              >
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="rural">Rural</option>
              </select>
            </div>

            {/* Experience Level */}
            <div>
              <label className={trainingGuideStyles.label}>
                Your Training Experience <span className="text-red-500">*</span>
              </label>
              <select
                name="experienceLevel"
                value={formData.experienceLevel}
                onChange={handleInputChange}
                className={trainingGuideStyles.select}
                required
              >
                <option value="none">None - First time dog owner</option>
                <option value="basic">Basic - Some experience</option>
                <option value="intermediate">Intermediate - Experienced</option>
              </select>
            </div>

            {/* Training Goals */}
            <div className={trainingGuideStyles.fullWidth}>
              <label className={trainingGuideStyles.label}>
                What do you want to work on? <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2 flex-wrap items-center">
                <select
                  value={selectedGoal}
                  onChange={(e) => setSelectedGoal(e.target.value)}
                  className={trainingGuideStyles.select}
                  style={{ minWidth: '200px' }}
                >
                  <option value="">Select a goal to add</option>
                  {TRAINING_GOAL_OPTIONS.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleAddGoal}
                  className={trainingGuideStyles.addGoalButton}
                >
                  Add
                </button>
              </div>
              {formData.trainingGoals && formData.trainingGoals.length > 0 && (
                <div className={trainingGuideStyles.goalsList}>
                  {formData.trainingGoals.map((goal) => (
                    <span key={goal} className={trainingGuideStyles.goalTag}>
                      {goal}
                      <button
                        type="button"
                        onClick={() => handleRemoveGoal(goal)}
                        className={trainingGuideStyles.removeGoalButton}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Behavior Issues */}
            <div className={trainingGuideStyles.fullWidth}>
              <label className={trainingGuideStyles.label}>
                Behavior issues to address (optional)
              </label>
              <div className="flex gap-2 flex-wrap items-center">
                <select
                  value={selectedBehaviorIssue}
                  onChange={(e) => setSelectedBehaviorIssue(e.target.value)}
                  className={trainingGuideStyles.select}
                  style={{ minWidth: '200px' }}
                >
                  <option value="">Select an issue to add</option>
                  {BEHAVIOR_ISSUE_OPTIONS.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleAddBehaviorIssue}
                  className={trainingGuideStyles.addGoalButton}
                >
                  Add
                </button>
              </div>
              {formData.behaviorIssues && formData.behaviorIssues.length > 0 && (
                <div className={trainingGuideStyles.goalsList}>
                  {formData.behaviorIssues.map((issue) => (
                    <span key={issue} className={trainingGuideStyles.goalTag}>
                      {issue}
                      <button
                        type="button"
                        onClick={() => handleRemoveBehaviorIssue(issue)}
                        className={trainingGuideStyles.removeGoalButton}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Additional details for the AI */}
            <div className={trainingGuideStyles.fullWidth}>
              <label className={trainingGuideStyles.label}>
                Additional details (optional)
              </label>
              <textarea
                name="healthNotes"
                value={formData.healthNotes}
                onChange={handleInputChange}
                className={trainingGuideStyles.textarea}
                rows={3}
                placeholder="Health concerns, physical limitations, or any other context you want the AI to consider..."
              />
            </div>
          </div>

          {error && (
            <div className={trainingGuideStyles.error}>
              <p className={trainingGuideStyles.errorText}>{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={trainingGuideStyles.submitButton}
          >
            {loading ? 'Generating Guide...' : 'Generate Training Guide'}
          </button>
        </form>
      ) : (
        <div className={trainingGuideStyles.guideContainer}>
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Personalized Training Guide</h2>
            <p className="text-gray-600">Tailored specifically for {formData.name}</p>
          </div>

          <div className={trainingGuideStyles.disclaimer}>
            <h3 className={trainingGuideStyles.disclaimerTitle}>⚠️ Important Disclaimer</h3>
            <p className={trainingGuideStyles.disclaimerText}>
              This training guide is for informational purposes only and does not replace
              professional dog training or veterinary care. Always consult with a certified
              dog trainer or veterinarian for specific concerns about your pet's behavior or
              health. If your dog shows signs of aggression or severe behavioral issues,
              please seek professional help immediately.
            </p>
          </div>

          <div className={trainingGuideStyles.guideContent}>
            {(() => {
              const lines = guide.split('\n');
              const elements: JSX.Element[] = [];
              let currentList: string[] = [];
              let currentNumberedList: string[] = [];
              let listKey = 0;
              let inParagraph = false;
              let paragraphLines: string[] = [];

              const flushList = () => {
                if (currentList.length > 0) {
                  elements.push(
                    <ul key={`list-${listKey++}`} className="list-disc ml-6 mb-4 space-y-2 text-gray-700">
                      {currentList.map((item, idx) => {
                        const processedItem = processInlineFormatting(item);
                        return <li key={idx} className="leading-relaxed">{processedItem}</li>;
                      })}
                    </ul>
                  );
                  currentList = [];
                }
              };

              const flushNumberedList = () => {
                if (currentNumberedList.length > 0) {
                  elements.push(
                    <ol key={`numbered-${listKey++}`} className="list-decimal ml-6 mb-4 space-y-2 text-gray-700">
                      {currentNumberedList.map((item, idx) => {
                        const processedItem = processInlineFormatting(item);
                        return <li key={idx} className="leading-relaxed">{processedItem}</li>;
                      })}
                    </ol>
                  );
                  currentNumberedList = [];
                }
              };

              const flushParagraph = () => {
                if (paragraphLines.length > 0) {
                  const paragraphText = paragraphLines.join(' ').trim();
                  if (paragraphText) {
                    const processed = processInlineFormatting(paragraphText);
                    elements.push(
                      <p key={`para-${listKey++}`} className="mb-4 leading-7 text-gray-700">
                        {processed}
                      </p>
                    );
                  }
                  paragraphLines = [];
                  inParagraph = false;
                }
              };

              const processInlineFormatting = (text: string): JSX.Element[] => {
                // Handle bold (**text**), italic (*text*), and combinations
                const parts: JSX.Element[] = [];
                let currentIndex = 0;
                
                // Match bold (**text**), italic (*text*), and bold+italic (***text***)
                const regex = /(\*\*\*.*?\*\*\*|\*\*.*?\*\*|\*.*?\*)/g;
                let match;
                let lastIndex = 0;

                while ((match = regex.exec(text)) !== null) {
                  // Add text before the match
                  if (match.index > lastIndex) {
                    parts.push(<span key={`text-${currentIndex++}`}>{text.substring(lastIndex, match.index)}</span>);
                  }

                  const matchedText = match[0];
                  if (matchedText.startsWith('***') && matchedText.endsWith('***')) {
                    // Bold and italic
                    const content = matchedText.substring(3, matchedText.length - 3);
                    parts.push(<strong key={`bold-italic-${currentIndex++}`}><em>{content}</em></strong>);
                  } else if (matchedText.startsWith('**') && matchedText.endsWith('**')) {
                    // Bold
                    const content = matchedText.substring(2, matchedText.length - 2);
                    parts.push(<strong key={`bold-${currentIndex++}`} className="font-semibold text-gray-900">{content}</strong>);
                  } else if (matchedText.startsWith('*') && matchedText.endsWith('*')) {
                    // Italic
                    const content = matchedText.substring(1, matchedText.length - 1);
                    parts.push(<em key={`italic-${currentIndex++}`} className="italic">{content}</em>);
                  }

                  lastIndex = regex.lastIndex;
                }

                // Add remaining text
                if (lastIndex < text.length) {
                  parts.push(<span key={`text-${currentIndex++}`}>{text.substring(lastIndex)}</span>);
                }

                return parts.length > 0 ? parts : [<span key="text">{text}</span>];
              };

              lines.forEach((line, index) => {
                const trimmedLine = line.trim();
                
                // Headers
                if (trimmedLine.startsWith('#### ')) {
                  flushParagraph();
                  flushList();
                  flushNumberedList();
                  elements.push(
                    <h4 key={index} className="text-lg font-bold mt-6 mb-3 text-gray-900 border-b border-gray-200 pb-2">
                      {trimmedLine.substring(5)}
                    </h4>
                  );
                } else if (trimmedLine.startsWith('### ')) {
                  flushParagraph();
                  flushList();
                  flushNumberedList();
                  elements.push(
                    <h3 key={index} className="text-xl font-bold mt-8 mb-4 text-gray-900">
                      {trimmedLine.substring(4)}
                    </h3>
                  );
                } else if (trimmedLine.startsWith('## ')) {
                  flushParagraph();
                  flushList();
                  flushNumberedList();
                  elements.push(
                    <h2 key={index} className="text-2xl font-bold mt-10 mb-5 text-gray-900 border-b-2 border-primary-200 pb-3">
                      {trimmedLine.substring(3)}
                    </h2>
                  );
                } else if (trimmedLine.startsWith('# ')) {
                  flushParagraph();
                  flushList();
                  flushNumberedList();
                  elements.push(
                    <h1 key={index} className="text-3xl font-bold mt-10 mb-6 text-gray-900">
                      {trimmedLine.substring(2)}
                    </h1>
                  );
                }
                // Numbered lists
                else if (/^\d+\.\s/.test(trimmedLine)) {
                  flushParagraph();
                  flushList();
                  const content = trimmedLine.replace(/^\d+\.\s/, '');
                  currentNumberedList.push(content);
                }
                // Bullet lists
                else if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
                  flushParagraph();
                  flushNumberedList();
                  const content = trimmedLine.substring(2);
                  currentList.push(content);
                }
                // Empty line
                else if (trimmedLine === '') {
                  flushParagraph();
                  flushList();
                  flushNumberedList();
                  // Don't add extra spacing if we just flushed content
                }
                // Regular paragraph text
                else {
                  flushList();
                  flushNumberedList();
                  if (!inParagraph) {
                    inParagraph = true;
                    paragraphLines = [trimmedLine];
                  } else {
                    paragraphLines.push(trimmedLine);
                  }
                }
              });

              // Flush any remaining content
              flushParagraph();
              flushList();
              flushNumberedList();

              return elements;
            })()}
          </div>

          <button
            onClick={() => {
              setGuide(null);
              setError(null);
            }}
            className="mt-8 w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            Generate New Guide
          </button>
        </div>
      )}

      {loading && (
        <div className={trainingGuideStyles.loading}>
          <p>Generating your personalized training guide...</p>
        </div>
      )}
    </div>
  );
};

export default TrainingGuide;
