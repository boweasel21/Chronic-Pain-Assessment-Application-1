/**
 * Treatment data definitions for Primary Cell Assessment
 * Organized by category with descriptions of what each treatment addresses
 */

export interface Treatment {
  id: string;
  name: string;
  category: 'medications' | 'procedures' | 'devices' | 'therapies' | 'mindBody';
  whatItFixed: string; // Description of what this treatment addresses for results page
}

export const TREATMENTS: readonly Treatment[] = [
  // Medications
  {
    id: 'opioids',
    name: 'Opioid Pain Medications',
    category: 'medications',
    whatItFixed: 'Acute pain signals and severe pain episodes',
  },
  {
    id: 'nsaids',
    name: 'NSAIDs (Ibuprofen, Naproxen)',
    category: 'medications',
    whatItFixed: 'Inflammation and tissue-level pain',
  },
  {
    id: 'muscle-relaxants',
    name: 'Muscle Relaxants',
    category: 'medications',
    whatItFixed: 'Muscle spasms and tension-related pain',
  },
  {
    id: 'gabapentinoids',
    name: 'Gabapentin or Lyrica',
    category: 'medications',
    whatItFixed: 'Nerve pain and electrical sensations',
  },
  {
    id: 'antidepressants',
    name: 'Antidepressants for Pain',
    category: 'medications',
    whatItFixed: 'Central nervous system pain signals',
  },
  {
    id: 'steroids',
    name: 'Corticosteroids',
    category: 'medications',
    whatItFixed: 'Inflammatory responses and immune activation',
  },
  {
    id: 'topical-creams',
    name: 'Topical Pain Creams',
    category: 'medications',
    whatItFixed: 'Surface-level and localized pain',
  },

  // Procedures
  {
    id: 'injections',
    name: 'Trigger Point or Joint Injections',
    category: 'procedures',
    whatItFixed: 'Localized inflammation and trigger points',
  },
  {
    id: 'nerve-blocks',
    name: 'Nerve Blocks',
    category: 'procedures',
    whatItFixed: 'Specific nerve pathway pain transmission',
  },
  {
    id: 'epidural',
    name: 'Epidural Steroid Injections',
    category: 'procedures',
    whatItFixed: 'Spinal nerve inflammation and radicular pain',
  },
  {
    id: 'radiofrequency',
    name: 'Radiofrequency Ablation',
    category: 'procedures',
    whatItFixed: 'Nerve conduction in targeted pain pathways',
  },
  {
    id: 'surgery',
    name: 'Surgery',
    category: 'procedures',
    whatItFixed: 'Structural abnormalities and mechanical pain sources',
  },

  // Devices
  {
    id: 'tens',
    name: 'TENS Unit',
    category: 'devices',
    whatItFixed: 'Gate control pain signals at the spinal level',
  },
  {
    id: 'spinal-cord-stim',
    name: 'Spinal Cord Stimulator',
    category: 'devices',
    whatItFixed: 'Pain signal transmission to the brain',
  },
  {
    id: 'pemf',
    name: 'PEMF Therapy',
    category: 'devices',
    whatItFixed: 'Cellular electrical activity and circulation',
  },

  // Therapies
  {
    id: 'physical-therapy',
    name: 'Physical Therapy',
    category: 'therapies',
    whatItFixed: 'Muscle weakness, joint mobility, and movement patterns',
  },
  {
    id: 'chiropractic',
    name: 'Chiropractic Care',
    category: 'therapies',
    whatItFixed: 'Spinal alignment and mechanical dysfunction',
  },
  {
    id: 'acupuncture',
    name: 'Acupuncture',
    category: 'therapies',
    whatItFixed: 'Energy meridians and localized inflammation',
  },
  {
    id: 'massage',
    name: 'Massage Therapy',
    category: 'therapies',
    whatItFixed: 'Muscle tension, trigger points, and circulation',
  },
  {
    id: 'occupational-therapy',
    name: 'Occupational Therapy',
    category: 'therapies',
    whatItFixed: 'Daily activity adaptations and ergonomic issues',
  },

  // Mind-Body
  {
    id: 'cbt',
    name: 'Cognitive Behavioral Therapy (CBT)',
    category: 'mindBody',
    whatItFixed: 'Pain perception, coping mechanisms, and stress responses',
  },
  {
    id: 'meditation',
    name: 'Meditation or Mindfulness',
    category: 'mindBody',
    whatItFixed: 'Stress-induced pain amplification and mental focus',
  },
  {
    id: 'yoga',
    name: 'Yoga',
    category: 'mindBody',
    whatItFixed: 'Flexibility, stress, and mind-body connection',
  },
  {
    id: 'biofeedback',
    name: 'Biofeedback',
    category: 'mindBody',
    whatItFixed: 'Autonomic nervous system regulation and awareness',
  },
] as const;

export type TreatmentId = typeof TREATMENTS[number]['id'];
export type TreatmentCategory = Treatment['category'];

/**
 * Get treatment by ID
 */
export const getTreatmentById = (id: string): Treatment | undefined => {
  return TREATMENTS.find((treatment) => treatment.id === id);
};

/**
 * Get treatments by category
 */
export const getTreatmentsByCategory = (category: TreatmentCategory): Treatment[] => {
  return TREATMENTS.filter((treatment) => treatment.category === category);
};

/**
 * Get treatments by multiple IDs
 */
export const getTreatmentsByIds = (ids: string[]): Treatment[] => {
  return ids
    .map((id) => getTreatmentById(id))
    .filter((treatment): treatment is Treatment => treatment !== undefined);
};

/**
 * Group treatments by category
 */
export const groupTreatmentsByCategory = (
  treatmentIds: string[]
): Record<TreatmentCategory, Treatment[]> => {
  const treatments = getTreatmentsByIds(treatmentIds);

  const grouped: Record<TreatmentCategory, Treatment[]> = {
    medications: [],
    procedures: [],
    devices: [],
    therapies: [],
    mindBody: [],
  };

  treatments.forEach((treatment) => {
    grouped[treatment.category].push(treatment);
  });

  return grouped;
};

/**
 * Check if treatment exists
 */
export const isValidTreatmentId = (id: string): boolean => {
  return TREATMENTS.some((treatment) => treatment.id === id);
};
