/**
 * Treatment data definitions for Primary Cell Assessment
 * Organized by category with descriptions of what each treatment addresses
 */

export interface Treatment {
  id: string;
  name: string;
  category: 'medications' | 'procedures' | 'devices' | 'therapies' | 'mindBody';
  whatItFixed: string; // Description of what this treatment addresses for results page
  parentId?: string;
}

export const TREATMENTS: readonly Treatment[] = [
  // Medications
  {
    id: 'otc-painkillers',
    name: 'Over-the-counter painkillers (Advil, Tylenol, Aleve)',
    category: 'medications',
    whatItFixed: 'Surface-level pain signals by reducing inflammation.',
  },
  {
    id: 'prescription-painkillers',
    name: 'Prescription painkillers',
    category: 'medications',
    whatItFixed: 'Pain perception by numbing nerve signals.',
  },
  {
    id: 'prescription-painkillers-hydrocodone',
    name: 'Hydrocodone (Vicodin, Norco)',
    category: 'medications',
    parentId: 'prescription-painkillers',
    whatItFixed: 'Acute pain by binding opioid receptors to mute signals.',
  },
  {
    id: 'prescription-painkillers-oxycodone',
    name: 'Oxycodone (OxyContin, Percocet)',
    category: 'medications',
    parentId: 'prescription-painkillers',
    whatItFixed: 'Severe pain signaling through opioid receptor activation.',
  },
  {
    id: 'prescription-painkillers-morphine',
    name: 'Morphine (MS Contin, Kadian)',
    category: 'medications',
    parentId: 'prescription-painkillers',
    whatItFixed: 'Spinal cord pain transmission through opioid receptor binding.',
  },
  {
    id: 'prescription-painkillers-fentanyl',
    name: 'Fentanyl (Duragesic patches)',
    category: 'medications',
    parentId: 'prescription-painkillers',
    whatItFixed: 'Breakthrough pain signals via potent opioid suppression.',
  },
  {
    id: 'prescription-painkillers-codeine',
    name: 'Codeine (Tylenol with Codeine)',
    category: 'medications',
    parentId: 'prescription-painkillers',
    whatItFixed: 'Moderate pain perception via opioid receptor occupation.',
  },
  {
    id: 'prescription-painkillers-hydromorphone',
    name: 'Hydromorphone (Dilaudid)',
    category: 'medications',
    parentId: 'prescription-painkillers',
    whatItFixed: 'Strong pain signals with rapid opioid receptor binding.',
  },
  {
    id: 'prescription-painkillers-methadone',
    name: 'Methadone',
    category: 'medications',
    parentId: 'prescription-painkillers',
    whatItFixed: 'Chronic pain cycles by dampening nerve signaling.',
  },
  {
    id: 'prescription-painkillers-tramadol',
    name: 'Tramadol (Ultram)',
    category: 'medications',
    parentId: 'prescription-painkillers',
    whatItFixed: 'Mixed opioid and neurotransmitter signaling for pain relief.',
  },
  {
    id: 'muscle-relaxers',
    name: 'Muscle relaxers',
    category: 'medications',
    whatItFixed: 'Muscle spasms and tension.',
  },
  {
    id: 'muscle-relaxers-cyclobenzaprine',
    name: 'Cyclobenzaprine (Flexeril)',
    category: 'medications',
    parentId: 'muscle-relaxers',
    whatItFixed: 'Muscle spasms through central nervous system sedation.',
  },
  {
    id: 'muscle-relaxers-baclofen',
    name: 'Baclofen',
    category: 'medications',
    parentId: 'muscle-relaxers',
    whatItFixed: 'Spasticity by calming overactive muscle reflexes.',
  },
  {
    id: 'nerve-pain-medicines',
    name: 'Nerve pain medicines (Gabapentin, Lyrica)',
    category: 'medications',
    whatItFixed: 'Electrical nerve firing patterns.',
  },
  {
    id: 'nerve-pain-medicines-gabapentin',
    name: 'Gabapentin',
    category: 'medications',
    parentId: 'nerve-pain-medicines',
    whatItFixed: 'Nerve excitability by modulating calcium channels.',
  },
  {
    id: 'nerve-pain-medicines-pregabalin',
    name: 'Pregabalin (Lyrica)',
    category: 'medications',
    parentId: 'nerve-pain-medicines',
    whatItFixed: 'Overactive nerve firing via calcium channel dampening.',
  },
  {
    id: 'antidepressants-for-pain',
    name: 'Antidepressants for pain',
    category: 'medications',
    whatItFixed: 'Brain chemistry tied to pain modulation.',
  },
  {
    id: 'antidepressants-duloxetine',
    name: 'Duloxetine (Cymbalta)',
    category: 'medications',
    parentId: 'antidepressants-for-pain',
    whatItFixed: 'Serotonin and norepinephrine regulation to mute pain.',
  },
  {
    id: 'antidepressants-amitriptyline',
    name: 'Amitriptyline',
    category: 'medications',
    parentId: 'antidepressants-for-pain',
    whatItFixed: 'Sleep disruption and nerve pain signals.',
  },
  {
    id: 'antidepressants-nortriptyline',
    name: 'Nortriptyline',
    category: 'medications',
    parentId: 'antidepressants-for-pain',
    whatItFixed: 'Neuropathic pain via serotonin/norepinephrine balance.',
  },
  {
    id: 'steroid-pills',
    name: 'Steroid pills (Prednisone, Medrol)',
    category: 'medications',
    whatItFixed: 'Inflammation and swelling.',
  },
  {
    id: 'steroid-pills-prednisone',
    name: 'Prednisone',
    category: 'medications',
    parentId: 'steroid-pills',
    whatItFixed: 'Inflammatory cascades through immune suppression.',
  },
  {
    id: 'steroid-pills-medrol',
    name: 'Methylprednisolone (Medrol Dose Pack)',
    category: 'medications',
    parentId: 'steroid-pills',
    whatItFixed: 'Acute inflammation via systemic corticosteroid dosing.',
  },
  {
    id: 'sleeping-pills',
    name: 'Sleeping pills',
    category: 'medications',
    whatItFixed: 'Sleep disruption created by pain.',
  },
  {
    id: 'sleeping-pills-zolpidem',
    name: 'Zolpidem (Ambien)',
    category: 'medications',
    parentId: 'sleeping-pills',
    whatItFixed: 'Sleep onset via GABA receptor activation.',
  },
  {
    id: 'sleeping-pills-eszopiclone',
    name: 'Eszopiclone (Lunesta)',
    category: 'medications',
    parentId: 'sleeping-pills',
    whatItFixed: 'Sleep maintenance through calming brain activity.',
  },
  {
    id: 'sleeping-pills-trazodone',
    name: 'Trazodone',
    category: 'medications',
    parentId: 'sleeping-pills',
    whatItFixed: 'Sleep continuity via serotonin modulation.',
  },
  {
    id: 'pain-creams-patches',
    name: 'Pain creams or patches (IcyHot, Biofreeze, Lidocaine, Salonpas)',
    category: 'medications',
    whatItFixed: 'Localized pain receptors on the surface.',
  },
  {
    id: 'cbd-marijuana',
    name: 'CBD or medical marijuana',
    category: 'medications',
    whatItFixed: 'Pain perception and stress response.',
  },

  // Treatments & Procedures
  {
    id: 'steroid-shots',
    name: 'Steroid or cortisone shots (in the back, joints, or SI joint)',
    category: 'procedures',
    whatItFixed: 'Inflamed joints or spinal segments.',
  },
  {
    id: 'nerve-blocks',
    name: 'Nerve blocks or injections',
    category: 'procedures',
    whatItFixed: 'Specific nerve pathways sending pain signals.',
  },
  {
    id: 'radiofrequency-ablation',
    name: 'Radiofrequency ablation (“burning” nerves to block pain)',
    category: 'procedures',
    whatItFixed: 'Pain-carrying nerves by burning them.',
  },
  {
    id: 'trigger-point-injections',
    name: 'Trigger point injections (for muscle knots)',
    category: 'procedures',
    whatItFixed: 'Muscle knots and trigger points.',
  },
  {
    id: 'spine-surgery',
    name: 'Surgery on the spine, discs, or joints (including spinal fusion)',
    category: 'procedures',
    whatItFixed: 'Structural issues like damaged discs or joints.',
  },
  {
    id: 'spinal-cord-stimulator',
    name: 'Spinal cord stimulator implant',
    category: 'procedures',
    whatItFixed: 'Pain messaging before it reaches the brain.',
  },
  {
    id: 'pain-pump',
    name: 'Pain pump implant',
    category: 'procedures',
    whatItFixed: 'Pain intensity using direct medication delivery.',
  },
  {
    id: 'stem-cell-therapy',
    name: 'Stem Cell Therapy',
    category: 'procedures',
    whatItFixed: 'Tissue regeneration in injured areas.',
  },
  {
    id: 'light-therapy',
    name: 'Light Therapy (LLLT, NIR, Cold Laser Therapy, Red Light Therapy)',
    category: 'procedures',
    whatItFixed: 'Inflammation and circulation with light stimulation.',
  },

  // Devices & Products
  {
    id: 'tens-unit',
    name: 'TENS unit (portable nerve zapper)',
    category: 'devices',
    whatItFixed: 'Pain signals through electrical distraction.',
  },
  {
    id: 'heating-pad',
    name: 'Heating pad or hot packs',
    category: 'devices',
    whatItFixed: 'Muscle stiffness with heat.',
  },
  {
    id: 'ice-packs',
    name: 'Ice packs or cold wraps',
    category: 'devices',
    whatItFixed: 'Inflammation and swelling.',
  },
  {
    id: 'massage-gun',
    name: 'Massage gun or handheld massager',
    category: 'devices',
    whatItFixed: 'Muscle tension and knots.',
  },
  {
    id: 'braces-supports',
    name: 'Braces or supports for neck, back, knee, wrist, or pelvis',
    category: 'devices',
    whatItFixed: 'Joint stability and alignment.',
  },
  {
    id: 'supportive-pillows',
    name: 'Supportive pillows, foam rollers, or ergonomic chairs',
    category: 'devices',
    whatItFixed: 'Posture and pressure points.',
  },
  {
    id: 'si-joint-belt',
    name: 'SI joint belt or other supportive wraps',
    category: 'devices',
    whatItFixed: 'Joint stability by compressing the area.',
  },
  {
    id: 'shoe-inserts',
    name: 'Shoe inserts for pain',
    category: 'devices',
    whatItFixed: 'Alignment and impact in feet and joints.',
  },
  {
    id: 'bath-soaks',
    name: 'Bath soaks (Epsom salt, warm water)',
    category: 'devices',
    whatItFixed: 'Muscle relaxation and circulation.',
  },
  {
    id: 'natural-supplements',
    name: 'Natural health supplements (Magnesium, Turmeric, Ginger, etc.)',
    category: 'devices',
    whatItFixed: 'Basic nutritional support and inflammation reduction.',
  },

  // Therapies, Bodywork & Lifestyle
  {
    id: 'physical-therapy',
    name: 'Physical therapy or rehab exercises',
    category: 'therapies',
    whatItFixed: 'Strength, mobility, and movement patterns.',
  },
  {
    id: 'chiropractic-care',
    name: 'Chiropractic care or osteopathic manipulation',
    category: 'therapies',
    whatItFixed: 'Joint alignment and mobility.',
  },
  {
    id: 'acupuncture',
    name: 'Acupuncture or dry needling',
    category: 'therapies',
    whatItFixed: 'Muscle tension and energy flow.',
  },
  {
    id: 'aqua-therapy',
    name: 'Aqua therapy or exercise in water',
    category: 'therapies',
    whatItFixed: 'Low-impact movement and joint relief.',
  },
  {
    id: 'stretching-yoga',
    name: 'Stretching, yoga, gentle exercise',
    category: 'therapies',
    whatItFixed: 'Flexibility and stress reduction.',
  },
  {
    id: 'massage-therapy',
    name: 'Massage therapy or cranial sacral massage',
    category: 'therapies',
    whatItFixed: 'Muscle tension and fascia restrictions.',
  },
  {
    id: 'diet-changes',
    name: 'Diet changes for inflammation',
    category: 'therapies',
    whatItFixed: 'Inflammatory burden through nutrition.',
  },
  {
    id: 'sleep-programs',
    name: 'Sleep improvement programs',
    category: 'therapies',
    whatItFixed: 'Restorative sleep disrupted by pain.',
  },

  // Mind-Body & Support
  {
    id: 'mindfulness',
    name: 'Mindfulness, meditation, relaxation practice',
    category: 'mindBody',
    whatItFixed: 'Stress and pain perception.',
  },
  {
    id: 'counseling',
    name: 'Counseling, therapy, or pain management classes',
    category: 'mindBody',
    whatItFixed: 'Coping skills and emotional strain.',
  },
  {
    id: 'support-groups',
    name: 'Support groups or community groups (online or in person)',
    category: 'mindBody',
    whatItFixed: 'Isolation and emotional support.',
  },
  {
    id: 'distraction',
    name: 'Distraction (music, hobbies, pets)',
    category: 'mindBody',
    whatItFixed: 'Focus away from pain for short relief.',
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
 * Get sub-treatments for a parent treatment id
 */
export const getSubTreatments = (parentId: string): Treatment[] => {
  return TREATMENTS.filter((treatment) => treatment.parentId === parentId);
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
