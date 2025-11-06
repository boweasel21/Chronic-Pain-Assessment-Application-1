/**
 * Condition data definitions for Primary Cell Assessment
 * Categorizes conditions into treatable and non-treatable groupings
 */

export interface Condition {
  id: string;
  name: string;
  category: 'treatable' | 'non-treatable';
  /**
   * Optional grouping label used for UI sections (e.g. "Injury-Related Pain")
   */
  group?: string;
}

export const CONDITIONS: readonly Condition[] = [
  // Treatable conditions sourced from WellnessInWeeks.com
  {
    id: 'physical-injury',
    name: 'Physical Injury (sports or everyday injuries that persist)',
    category: 'treatable',
    group: 'Injury-Related Pain',
  },
  {
    id: 'post-traumatic-pain',
    name: 'Post-Traumatic Pain (continues after an injury)',
    category: 'treatable',
    group: 'Injury-Related Pain',
  },
  {
    id: 'whiplash',
    name: 'Whiplash from sudden neck movement',
    category: 'treatable',
    group: 'Injury-Related Pain',
  },
  {
    id: 'tendon-ligament-pain',
    name: 'Tendon & Ligament Pain lasting 12+ months',
    category: 'treatable',
    group: 'Injury-Related Pain',
  },
  {
    id: 'chronic-back-neck',
    name: 'Chronic Back or Neck Pain (muscle strain, tightness, stiffness)',
    category: 'treatable',
    group: 'Chronic Pain Conditions',
  },
  {
    id: 'osteoarthritis',
    name: 'Osteoarthritis Pain affecting joints, neck, or back',
    category: 'treatable',
    group: 'Chronic Pain Conditions',
  },
  {
    id: 'degenerative-bone',
    name: 'Degenerative Bone-on-Bone Pain from cartilage breakdown',
    category: 'treatable',
    group: 'Chronic Pain Conditions',
  },
  {
    id: 'herniated-disc',
    name: 'Herniated Disc pain',
    category: 'treatable',
    group: 'Chronic Pain Conditions',
  },
  {
    id: 'bulging-disc',
    name: 'Bulging Disc pain',
    category: 'treatable',
    group: 'Chronic Pain Conditions',
  },
  {
    id: 'spinal-stenosis',
    name: 'Spinal Stenosis & Spondylosis pain',
    category: 'treatable',
    group: 'Chronic Pain Conditions',
  },
  {
    id: 'phantom-limb',
    name: 'Phantom Limb Pain',
    category: 'treatable',
    group: 'Neuropathic Pain',
  },
  {
    id: 'sciatica',
    name: 'Sciatica (constant pain radiating along the sciatic nerve)',
    category: 'treatable',
    group: 'Neuropathic Pain',
  },
  {
    id: 'sacroiliac-dysfunction',
    name: 'Sacroiliac Joint Dysfunction (constant SI joint pain)',
    category: 'treatable',
    group: 'Neuropathic Pain',
  },
  {
    id: 'spontaneous-pain',
    name: 'Pain Appearing Out of the Blue (persistent without clear cause)',
    category: 'treatable',
    group: 'Unknown Origin of Pain',
  },
  {
    id: 'pelvic-pain',
    name: 'Pelvic Pain (chronic)',
    category: 'treatable',
    group: 'Pelvic Pain',
  },

  // Non-treatable conditions currently outside program scope
  {
    id: 'chronic-fatigue',
    name: 'Chronic Fatigue Syndrome (ME/CFS)',
    category: 'non-treatable',
  },
  {
    id: 'autoimmune-disease',
    name: 'Autoimmune Disease (e.g., rheumatoid arthritis, lupus, MS)',
    category: 'non-treatable',
  },
  {
    id: 'fibromyalgia',
    name: 'Fibromyalgia',
    category: 'non-treatable',
  },
  {
    id: 'infectious-disease',
    name: 'Infectious Diseases (e.g., HIV/AIDS, Hepatitis C)',
    category: 'non-treatable',
  },
  {
    id: 'traumatic-brain-injury',
    name: 'Traumatic Brain Injury (TBI)',
    category: 'non-treatable',
  },
  {
    id: 'endocrine-disorder',
    name: 'Endocrine Disorders (e.g., hypothyroidism, Cushing’s)',
    category: 'non-treatable',
  },
  {
    id: 'gastrointestinal-disorder',
    name: 'Gastrointestinal Disorders (e.g., IBS, IBD)',
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
