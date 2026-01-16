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
  const [currentGoal, setCurrentGoal] = useState('');
  const [currentBehaviorIssue, setCurrentBehaviorIssue] = useState('');
  const [loading, setLoading] = useState(false);
  const [guide, setGuide] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddGoal = () => {
    if (currentGoal.trim() && !formData.trainingGoals?.includes(currentGoal.trim())) {
      setFormData((prev) => ({
        ...prev,
        trainingGoals: [...(prev.trainingGoals || []), currentGoal.trim()],
      }));
      setCurrentGoal('');
    }
  };

  const handleRemoveGoal = (goal: string) => {
    setFormData((prev) => ({
      ...prev,
      trainingGoals: prev.trainingGoals?.filter((g) => g !== goal) || [],
    }));
  };

  const handleAddBehaviorIssue = () => {
    if (
      currentBehaviorIssue.trim() &&
      !formData.behaviorIssues?.includes(currentBehaviorIssue.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        behaviorIssues: [...(prev.behaviorIssues || []), currentBehaviorIssue.trim()],
      }));
      setCurrentBehaviorIssue('');
    }
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
                Age (months) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="ageMonths"
                value={formData.ageMonths}
                onChange={handleInputChange}
                min="1"
                max="240"
                className={trainingGuideStyles.input}
                required
              />
            </div>

            {/* Breed */}
            <div>
              <label className={trainingGuideStyles.label}>Breed (optional)</label>
              <input
                type="text"
                name="breed"
                value={formData.breed}
                onChange={handleInputChange}
                className={trainingGuideStyles.input}
                placeholder="e.g., Golden Retriever"
              />
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
                Training Goals <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={currentGoal}
                  onChange={(e) => setCurrentGoal(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddGoal();
                    }
                  }}
                  className={trainingGuideStyles.goalsInput}
                  placeholder="e.g., Sit, Stay, Come when called"
                />
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
                Behavior Issues (optional)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={currentBehaviorIssue}
                  onChange={(e) => setCurrentBehaviorIssue(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddBehaviorIssue();
                    }
                  }}
                  className={trainingGuideStyles.goalsInput}
                  placeholder="e.g., Jumping on people, Pulling on leash"
                />
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

            {/* Health Notes */}
            <div className={trainingGuideStyles.fullWidth}>
              <label className={trainingGuideStyles.label}>
                Health Notes (optional)
              </label>
              <textarea
                name="healthNotes"
                value={formData.healthNotes}
                onChange={handleInputChange}
                className={trainingGuideStyles.textarea}
                rows={3}
                placeholder="Any health concerns or physical limitations we should consider..."
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
          <div className={trainingGuideStyles.disclaimer}>
            <h3 className={trainingGuideStyles.disclaimerTitle}>Important Disclaimer</h3>
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
              let listKey = 0;

              const flushList = () => {
                if (currentList.length > 0) {
                  elements.push(
                    <ul key={`list-${listKey++}`} className="list-disc ml-6 mb-4 space-y-1">
                      {currentList.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  );
                  currentList = [];
                }
              };

              lines.forEach((line, index) => {
                if (line.startsWith('## ')) {
                  flushList();
                  elements.push(
                    <h2 key={index} className="text-2xl font-bold mt-6 mb-3">
                      {line.substring(3)}
                    </h2>
                  );
                } else if (line.startsWith('### ')) {
                  flushList();
                  elements.push(
                    <h3 key={index} className="text-xl font-bold mt-4 mb-2">
                      {line.substring(4)}
                    </h3>
                  );
                } else if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
                  currentList.push(line.substring(2).trim());
                } else if (line.trim() === '') {
                  flushList();
                  elements.push(<br key={index} />);
                } else {
                  flushList();
                  // Handle bold text
                  const parts = line.split(/(\*\*.*?\*\*)/g);
                  elements.push(
                    <p key={index} className="mb-3">
                      {parts.map((part, partIndex) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                          return (
                            <strong key={partIndex}>
                              {part.substring(2, part.length - 2)}
                            </strong>
                          );
                        }
                        return <span key={partIndex}>{part}</span>;
                      })}
                    </p>
                  );
                }
              });
              flushList();
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
