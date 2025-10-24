/**
 * Condition data definitions for Primary Cell Assessment
 * Categorizes conditions into treatable and non-treatable
 */

export interface Condition {
  id: string;
  name: string;
  category: 'treatable' | 'non-treatable';
}

export const CONDITIONS: readonly Condition[] = [
  // Treatable conditions (15)
  {
    id: 'fibromyalgia',
    name: 'Fibromyalgia',
    category: 'treatable',
  },
  {
    id: 'chronic-fatigue',
    name: 'Chronic Fatigue Syndrome (ME/CFS)',
    category: 'treatable',
  },
  {
    id: 'neuropathy',
    name: 'Peripheral Neuropathy',
    category: 'treatable',
  },
  {
    id: 'complex-regional',
    name: 'Complex Regional Pain Syndrome (CRPS)',
    category: 'treatable',
  },
  {
    id: 'migraine',
    name: 'Chronic Migraines',
    category: 'treatable',
  },
  {
    id: 'back-pain',
    name: 'Chronic Back Pain',
    category: 'treatable',
  },
  {
    id: 'arthritis',
    name: 'Rheumatoid Arthritis',
    category: 'treatable',
  },
  {
    id: 'lupus',
    name: 'Lupus',
    category: 'treatable',
  },
  {
    id: 'lyme',
    name: 'Chronic Lyme Disease',
    category: 'treatable',
  },
  {
    id: 'neck-pain',
    name: 'Chronic Neck Pain',
    category: 'treatable',
  },
  {
    id: 'joint-pain',
    name: 'Chronic Joint Pain',
    category: 'treatable',
  },
  {
    id: 'muscle-pain',
    name: 'Chronic Muscle Pain (Myalgia)',
    category: 'treatable',
  },
  {
    id: 'tension-headaches',
    name: 'Chronic Tension Headaches',
    category: 'treatable',
  },
  {
    id: 'autoimmune',
    name: 'Autoimmune-Related Pain',
    category: 'treatable',
  },
  {
    id: 'ehlers-danlos',
    name: 'Ehlers-Danlos Syndrome (EDS)',
    category: 'treatable',
  },

  // Non-treatable conditions (10)
  {
    id: 'cancer-pain',
    name: 'Cancer-Related Pain',
    category: 'non-treatable',
  },
  {
    id: 'post-surgical',
    name: 'Post-Surgical Pain (Acute)',
    category: 'non-treatable',
  },
  {
    id: 'active-injury',
    name: 'Active Injury or Trauma',
    category: 'non-treatable',
  },
  {
    id: 'severe-psychiatric',
    name: 'Severe Psychiatric Disorder',
    category: 'non-treatable',
  },
  {
    id: 'kidney-disease',
    name: 'Advanced Kidney Disease',
    category: 'non-treatable',
  },
  {
    id: 'liver-disease',
    name: 'Advanced Liver Disease',
    category: 'non-treatable',
  },
  {
    id: 'heart-failure',
    name: 'Congestive Heart Failure',
    category: 'non-treatable',
  },
  {
    id: 'unstable-cardiac',
    name: 'Unstable Cardiac Condition',
    category: 'non-treatable',
  },
  {
    id: 'severe-copd',
    name: 'Severe COPD',
    category: 'non-treatable',
  },
  {
    id: 'dementia',
    name: 'Dementia or Severe Cognitive Impairment',
    category: 'non-treatable',
  },
] as const;

export type ConditionId = typeof CONDITIONS[number]['id'];

/**
 * Get condition by ID
 */
export const getConditionById = (id: string): Condition | undefined => {
  return CONDITIONS.find((condition) => condition.id === id);
};

/**
 * Get all treatable conditions
 */
export const getTreatableConditions = (): Condition[] => {
  return CONDITIONS.filter((condition) => condition.category === 'treatable');
};

/**
 * Get all non-treatable conditions
 */
export const getNonTreatableConditions = (): Condition[] => {
  return CONDITIONS.filter((condition) => condition.category === 'non-treatable');
};

/**
 * Check if a condition is treatable
 */
export const isConditionTreatable = (id: string): boolean => {
  const condition = getConditionById(id);
  return condition?.category === 'treatable';
};
