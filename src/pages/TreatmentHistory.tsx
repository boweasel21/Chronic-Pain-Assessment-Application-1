/**
 * Page 4: Treatment History Assessment
 * Collects information about treatments attempted for chronic pain
 */

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAssessment } from '@context/AssessmentContext';
import { Button } from '@components/common/Button';
import { Checkbox } from '@components/common/Checkbox';
import { TREATMENTS, getTreatmentsByCategory } from '@data/treatments';
import styles from './TreatmentHistory.module.css';

/**
 * Treatment category configuration
 */
interface CategoryConfig {
  id: string;
  emoji: string;
  title: string;
  category: 'medications' | 'procedures' | 'devices' | 'therapies' | 'mindBody';
}

const CATEGORIES: readonly CategoryConfig[] = [
  {
    id: 'medications',
    emoji: '💊',
    title: 'Medications',
    category: 'medications',
  },
  {
    id: 'procedures',
    emoji: '🏥',
    title: 'Treatments & Procedures',
    category: 'procedures',
  },
  {
    id: 'devices',
    emoji: '🔧',
    title: 'Devices & Products',
    category: 'devices',
  },
  {
    id: 'therapies',
    emoji: '🧘',
    title: 'Therapies, Bodywork & Lifestyle',
    category: 'therapies',
  },
  {
    id: 'mindBody',
    emoji: '🧠',
    title: 'Mind-Body & Support',
    category: 'mindBody',
  },
] as const;

/**
 * Treatment History Page Component
 *
 * @description Displays expandable treatment categories for user selection.
 * No validation required - user can skip. Updates context on navigation.
 * Features animated expand/collapse and real-time selection count.
 *
 * @returns {JSX.Element} Treatment history assessment page
 */
const TreatmentHistory = (): JSX.Element => {
  const navigate = useNavigate();
  const { state, updateResponse } = useAssessment();

  const [selectedTreatments, setSelectedTreatments] = useState<string[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [otherTreatments, setOtherTreatments] = useState('');

  /**
   * Load saved data from localStorage on mount
   */
  useEffect(() => {
    const saved = localStorage.getItem('assessment_treatment_history');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setSelectedTreatments(data.selectedTreatments || []);
        setOtherTreatments(data.otherTreatments || '');
      } catch (error) {
        // Silent fail - invalid JSON
      }
    }
  }, []);

  /**
   * Auto-save to localStorage whenever selection changes
   */
  useEffect(() => {
    const data = {
      selectedTreatments,
      otherTreatments,
    };
    localStorage.setItem('assessment_treatment_history', JSON.stringify(data));
  }, [selectedTreatments, otherTreatments]);

  /**
   * Get count of selected treatments per category
   */
  const getCategoryCount = useCallback((categoryId: string): number => {
    const categoryTreatments = getTreatmentsByCategory(
      categoryId as CategoryConfig['category']
    );
    const selectedInCategory = categoryTreatments.filter((t) =>
      selectedTreatments.includes(t.id)
    );
    return selectedInCategory.length;
  }, [selectedTreatments]);

  /**
   * Toggle category expansion
   */
  const toggleCategory = useCallback((categoryId: string): void => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  }, []);

  /**
   * Toggle treatment selection
   */
  const toggleTreatment = useCallback((treatmentId: string): void => {
    setSelectedTreatments((prev) =>
      prev.includes(treatmentId)
        ? prev.filter((id) => id !== treatmentId)
        : [...prev, treatmentId]
    );
  }, []);

  /**
   * Handle navigation to next page
   */
  const handleNext = useCallback((): void => {
    updateResponse({
      treatmentHistory: selectedTreatments,
      otherTreatments: otherTreatments.trim() || null,
    });

    navigate('/urgency-assessment');
  }, [selectedTreatments, otherTreatments, updateResponse, navigate]);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Header Section */}
        <header className={styles.header}>
          <motion.div
            className={styles.headerContent}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className={styles.title}>
              Our system is now running your Personalized Pain Pattern Profile to determine if we believe we can help you.
            </h1>
            <p className={styles.subtitle}>
              While that’s being generated, we’d like to learn more about you.
            </p>
          </motion.div>
        </header>

        {/* Question */}
        <motion.div
          className={styles.question}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h2 className={styles.questionText}>
            Please check everything you have tried to fix your chronic pain.
          </h2>
        </motion.div>

        {/* Treatment Categories */}
        <div className={styles.categories}>
          {CATEGORIES.map((category, index) => {
            const isExpanded = expandedCategories.includes(category.id);
            const categoryTreatments = getTreatmentsByCategory(category.category);
            const selectedCount = getCategoryCount(category.id);

            return (
              <motion.div
                key={category.id}
                className={styles.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
              >
                {/* Category Header */}
                <button
                  className={styles.categoryHeader}
                  onClick={() => toggleCategory(category.id)}
                  aria-expanded={isExpanded}
                  aria-controls={`category-${category.id}`}
                >
                  <span className={styles.categoryEmoji} aria-hidden="true">
                    {category.emoji}
                  </span>
                  <span className={styles.categoryTitle}>{category.title}</span>
                  {selectedCount > 0 && (
                    <span className={styles.categoryBadge}>
                      {selectedCount}
                    </span>
                  )}
                  <motion.span
                    className={styles.categoryIcon}
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    aria-hidden="true"
                  >
                    ▼
                  </motion.span>
                </button>

                {/* Category Content */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      id={`category-${category.id}`}
                      className={styles.categoryContent}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      <div className={styles.treatmentGrid}>
                        {categoryTreatments.map((treatment) => (
                          <Checkbox
                            key={treatment.id}
                            id={`treatment-${treatment.id}`}
                            label={treatment.name}
                            checked={selectedTreatments.includes(treatment.id)}
                            onChange={() => toggleTreatment(treatment.id)}
                            aria-label={`Select ${treatment.name}`}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Other Treatments Textarea */}
        <motion.div
          className={styles.otherSection}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
      <label htmlFor="other-treatments" className={styles.otherLabel}>
        Others:
      </label>
      <textarea
        id="other-treatments"
        className={styles.otherTextarea}
        value={otherTreatments}
        onChange={(e) => setOtherTreatments(e.target.value)}
        rows={4}
        aria-label="Others"
      />
    </motion.div>

        {/* Navigation */}
        <motion.div
          className={styles.navigation}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
        >
      <Button
        variant="primary"
        size="large"
        onClick={handleNext}
        aria-label="Go to the next page of the assessment"
        fullWidth
      >
        Next Page
      </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default TreatmentHistory;
