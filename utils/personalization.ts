/**
 * Personalization utility for Primary Cell Assessment
 * Generates personalized results based on user responses
 */

import { getTreatmentsByIds, groupTreatmentsByCategory, Treatment } from '../data/treatments';
import { getSensationsByIds, Sensation } from '../data/sensations';
import { getConditionById } from '../data/conditions';
import { PRIMARY_CELL_MESSAGING } from './constants';

/**
 * Assessment responses for personalization
 */
export interface PersonalizationResponses {
  conditions: string[];
  sensations: string[];
  duration?: string;
  intensity?: number;
  previousTreatments?: string[];
  activityImpact?: string;
  goals?: string;
}

/**
 * Treatment breakdown by category
 */
export interface TreatmentBreakdown {
  medications: Treatment[];
  procedures: Treatment[];
  devices: Treatment[];
  therapies: Treatment[];
  mindBody: Treatment[];
}

/**
 * What treatments addressed vs missed
 */
export interface TreatmentAnalysis {
  whatWasFixed: string[];
  whatWasMissed: string[];
  totalTreatmentsTried: number;
  hasTriedTreatments: boolean;
}

/**
 * Individual treatment breakdown card data
 */
export interface TreatmentCard {
  id: string;
  name: string;
  category: string;
  whatItFixed: string;
  whatItMissed: string;
  result: string;
}

/**
 * Personalized result structure
 */
export interface PersonalizationResult {
  conditions: Array<{ id: string; name: string; category: string }>;
  sensations: Sensation[];
  treatmentBreakdown: TreatmentBreakdown;
  treatmentAnalysis: TreatmentAnalysis;
  treatmentCards: TreatmentCard[];
  summaryParagraph: string;
  primaryCellMessage: string;
  isQualified: boolean;
  conditionsWithSensations: Array<{
    condition: { id: string; name: string; category: string };
    sensations: Sensation[];
  }>;
}

/**
 * Maps conditions to their common associated symptoms
 * Used to generate the "what was missed" analysis
 */
const CONDITION_SYMPTOM_MAP: Record<string, string[]> = {
  fibromyalgia: ['widespread muscle pain', 'fatigue', 'sleep disturbances'],
  'chronic-fatigue': ['severe fatigue', 'post-exertional malaise', 'cognitive dysfunction'],
  neuropathy: ['nerve pain', 'tingling', 'numbness'],
  'complex-regional': ['severe burning pain', 'temperature sensitivity', 'swelling'],
  migraine: ['severe headaches', 'light sensitivity', 'nausea'],
  'back-pain': ['lower back pain', 'stiffness', 'limited mobility'],
  arthritis: ['joint pain', 'inflammation', 'morning stiffness'],
  lupus: ['joint pain', 'fatigue', 'inflammatory symptoms'],
  lyme: ['fatigue', 'joint pain', 'neurological symptoms'],
  'neck-pain': ['neck stiffness', 'limited range of motion', 'headaches'],
  'joint-pain': ['joint stiffness', 'swelling', 'reduced mobility'],
  'muscle-pain': ['muscle aches', 'tenderness', 'weakness'],
  'tension-headaches': ['head pressure', 'neck tension', 'jaw pain'],
  autoimmune: ['systemic inflammation', 'fatigue', 'variable symptoms'],
  'ehlers-danlos': ['joint hypermobility', 'chronic pain', 'easy bruising'],
};

/**
 * Generates personalized results based on assessment responses
 * @param responses - User's assessment responses
 * @returns Personalized result with treatment analysis and recommendations
 */
export const generatePersonalizedResults = (
  responses: PersonalizationResponses
): PersonalizationResult => {
  try {
    // Validate required fields
    if (!responses.conditions || responses.conditions.length === 0) {
      throw new Error('Conditions are required for personalization');
    }

    if (!responses.sensations || responses.sensations.length === 0) {
      throw new Error('Sensations are required for personalization');
    }

    // Get condition details
    const conditions = responses.conditions
      .map((id) => getConditionById(id))
      .filter((condition): condition is NonNullable<typeof condition> => condition !== undefined)
      .map((condition) => ({
        id: condition.id,
        name: condition.name,
        category: condition.category,
      }));

    // Get sensation details
    const sensations = getSensationsByIds(responses.sensations);

    // Get treatment breakdown
    const previousTreatments = responses.previousTreatments || [];
    const treatments = getTreatmentsByIds(previousTreatments);
    const treatmentBreakdown = groupTreatmentsByCategory(previousTreatments);

    // Generate treatment analysis
    const treatmentAnalysis = analyzeTreatments(treatments, conditions, sensations);

    // Generate treatment cards for each treatment
    const treatmentCards = generateTreatmentCards(treatments, conditions);

    // Generate summary paragraph
    const summaryParagraph = generateSummaryParagraph(
      conditions,
      sensations,
      treatments,
      responses
    );

    // Map conditions to their sensations for display
    const conditionsWithSensations = mapConditionsToSensations(conditions, sensations);

    // Determine if user is qualified (has at least one treatable condition)
    const isQualified = conditions.some((c) => c.category === 'treatable');

    return {
      conditions,
      sensations,
      treatmentBreakdown,
      treatmentAnalysis,
      treatmentCards,
      summaryParagraph,
      primaryCellMessage: PRIMARY_CELL_MESSAGING.UNTREATED_EXPLANATION,
      isQualified,
      conditionsWithSensations,
    };
  } catch (error) {
    // Handle errors gracefully
    console.error('Error generating personalized results:', error);

    // Return default result structure
    return {
      conditions: [],
      sensations: [],
      treatmentBreakdown: {
        medications: [],
        procedures: [],
        devices: [],
        therapies: [],
        mindBody: [],
      },
      treatmentAnalysis: {
        whatWasFixed: [],
        whatWasMissed: ['Unable to generate analysis'],
        totalTreatmentsTried: 0,
        hasTriedTreatments: false,
      },
      treatmentCards: [],
      summaryParagraph: 'Unable to generate personalized summary. Please try again.',
      primaryCellMessage: PRIMARY_CELL_MESSAGING.UNTREATED_EXPLANATION,
      isQualified: false,
      conditionsWithSensations: [],
    };
  }
};

/**
 * Analyzes what treatments addressed vs what they missed
 * @param treatments - Treatments user has tried
 * @param conditions - User's conditions
 * @param sensations - User's pain sensations
 * @returns Treatment analysis with fixed vs missed items
 */
const analyzeTreatments = (
  treatments: Treatment[],
  conditions: Array<{ id: string; name: string; category: string }>,
  sensations: Sensation[]
): TreatmentAnalysis => {
  const hasTriedTreatments = treatments.length > 0;

  if (!hasTriedTreatments) {
    // No treatments tried - everything is untreated
    const whatWasMissed = [
      'Primary Cell damage causing chronic pain',
      'Underlying cellular dysfunction',
      'Root cause of persistent symptoms',
    ];

    return {
      whatWasFixed: [],
      whatWasMissed,
      totalTreatmentsTried: 0,
      hasTriedTreatments: false,
    };
  }

  // What was fixed: Extract from treatment data
  const whatWasFixed = treatments.map((treatment) => treatment.whatItFixed);

  // What was missed: Always includes Primary Cell damage
  const whatWasMissed = [
    'Primary Cell damage - the underlying cellular dysfunction',
    'Mitochondrial energy production issues',
    'Cellular membrane integrity problems',
  ];

  // Add condition-specific missed items
  conditions.forEach((condition) => {
    const symptoms = CONDITION_SYMPTOM_MAP[condition.id] || [];
    symptoms.forEach((symptom) => {
      // Only add if not already in the list
      if (!whatWasMissed.includes(symptom)) {
        whatWasMissed.push(`Residual ${symptom} symptoms`);
      }
    });
  });

  // Add sensation-specific missed items
  if (sensations.length > 0) {
    whatWasMissed.push('Persistent pain sensations despite treatments');
  }

  return {
    whatWasFixed,
    whatWasMissed,
    totalTreatmentsTried: treatments.length,
    hasTriedTreatments: true,
  };
};

/**
 * Generates a personalized summary paragraph
 * @param conditions - User's conditions
 * @param sensations - User's pain sensations
 * @param treatments - Treatments user has tried
 * @param responses - Full assessment responses
 * @returns Summary paragraph string
 */
const generateSummaryParagraph = (
  conditions: Array<{ id: string; name: string; category: string }>,
  sensations: Sensation[],
  treatments: Treatment[],
  responses: PersonalizationResponses
): string => {
  const parts: string[] = [];

  // Opening statement about conditions
  if (conditions.length === 1) {
    parts.push(`You're dealing with ${conditions[0].name}`);
  } else if (conditions.length === 2) {
    parts.push(`You're dealing with ${conditions[0].name} and ${conditions[1].name}`);
  } else {
    const conditionNames = conditions.map((c) => c.name);
    const lastCondition = conditionNames.pop();
    parts.push(`You're dealing with ${conditionNames.join(', ')}, and ${lastCondition}`);
  }

  // Add pain sensations
  if (sensations.length > 0) {
    const sensationNames = sensations.map((s) => s.name.toLowerCase());
    if (sensationNames.length === 1) {
      parts.push(`experiencing ${sensationNames[0]} pain`);
    } else if (sensationNames.length === 2) {
      parts.push(`experiencing ${sensationNames[0]} and ${sensationNames[1]} pain`);
    } else {
      const lastSensation = sensationNames.pop();
      parts.push(`experiencing ${sensationNames.join(', ')}, and ${lastSensation} pain`);
    }
  }

  // Add duration if available
  if (responses.duration) {
    const durationText = getDurationText(responses.duration);
    parts.push(`that has persisted for ${durationText}`);
  }

  // Add treatment history
  if (treatments.length === 0) {
    parts.push(
      'Despite your symptoms, you haven\'t yet found treatments that address the root cause'
    );
  } else if (treatments.length <= 2) {
    parts.push(
      `Despite trying ${treatments.length} treatment${treatments.length > 1 ? 's' : ''}, ` +
        `you're still experiencing symptoms`
    );
  } else {
    parts.push(
      `Despite trying ${treatments.length} different treatments, ` +
        `you're still experiencing persistent symptoms`
    );
  }

  // Closing statement
  parts.push(
    'This suggests that the underlying Primary Cell damage has not been addressed, ' +
      'which is why your symptoms continue'
  );

  // Join parts into a coherent paragraph
  return parts.join('. ') + '.';
};

/**
 * Converts duration code to readable text
 * @param duration - Duration code
 * @returns Readable duration text
 */
const getDurationText = (duration: string): string => {
  const durationMap: Record<string, string> = {
    'less-than-6-months': 'less than 6 months',
    '6-months-to-2-years': '6 months to 2 years',
    '2-to-5-years': '2 to 5 years',
    'more-than-5-years': 'more than 5 years',
  };

  return durationMap[duration] || 'an extended period';
};

/**
 * Generates a treatment gap summary
 * @param analysis - Treatment analysis result
 * @returns Summary of treatment gaps
 */
export const generateTreatmentGapSummary = (analysis: TreatmentAnalysis): string => {
  if (!analysis.hasTriedTreatments) {
    return (
      'You haven\'t tried treatments yet, which means the underlying Primary Cell damage ' +
      'causing your chronic pain remains completely unaddressed.'
    );
  }

  const treatedCount = analysis.whatWasFixed.length;
  const untreatedCount = analysis.whatWasMissed.length;

  return (
    `Your ${analysis.totalTreatmentsTried} treatment${analysis.totalTreatmentsTried > 1 ? 's' : ''} ` +
    `addressed ${treatedCount} symptom${treatedCount > 1 ? 's' : ''}, ` +
    `but left ${untreatedCount} underlying issue${untreatedCount > 1 ? 's' : ''} unaddressed - ` +
    `most critically, the Primary Cell damage that's at the root of your chronic pain.`
  );
};

/**
 * Gets recommended next steps based on results
 * @param result - Personalization result
 * @returns Array of recommended next steps
 */
export const getRecommendedNextSteps = (result: PersonalizationResult): string[] => {
  const steps: string[] = [];

  if (!result.isQualified) {
    steps.push('Speak with your primary care physician about your condition');
    steps.push('Consider specialized care for your specific medical needs');
    return steps;
  }

  steps.push('Schedule a consultation to discuss Primary Cell treatment options');

  if (result.treatmentAnalysis.hasTriedTreatments) {
    steps.push('Review your previous treatment history with our specialists');
  }

  steps.push('Learn more about how Primary Cell therapy addresses root causes');
  steps.push('Explore personalized treatment plans designed for your condition');

  return steps;
};

/**
 * Generates individual treatment cards with what was fixed, missed, and result
 * @param treatments - Treatments user has tried
 * @param conditions - User's conditions
 * @returns Array of treatment cards
 */
const generateTreatmentCards = (
  treatments: Treatment[],
  conditions: Array<{ id: string; name: string; category: string }>
): TreatmentCard[] => {
  return treatments.map((treatment) => {
    // What it fixed comes from treatment data
    const whatItFixed = treatment.whatItFixed;

    // What it missed is always Primary Cell damage
    const whatItMissed = 'Primary Cell damage - the underlying cellular dysfunction causing persistent symptoms';

    // Result is always temporary relief pattern
    const result = generateTreatmentResult(treatment, conditions);

    return {
      id: treatment.id,
      name: treatment.name,
      category: treatment.category,
      whatItFixed,
      whatItMissed,
      result,
    };
  });
};

/**
 * Generates the result text for a specific treatment
 * @param treatment - Treatment to analyze
 * @param conditions - User's conditions
 * @returns Result description
 */
const generateTreatmentResult = (
  treatment: Treatment,
  conditions: Array<{ id: string; name: string; category: string }>
): string => {
  // Mind-body approaches have different result patterns
  if (treatment.category === 'mindBody') {
    return 'Helped manage symptoms and improve coping, but pain persisted at cellular level';
  }

  // Procedures typically have more dramatic but temporary results
  if (treatment.category === 'procedures') {
    return 'Temporary relief, but symptoms returned as Primary Cell damage remained unaddressed';
  }

  // Medications and devices typically provide ongoing but incomplete relief
  if (treatment.category === 'medications' || treatment.category === 'devices') {
    return 'Reduced pain signals temporarily, but did not address root cellular dysfunction';
  }

  // Therapies help with mobility and function but don't fix cellular issues
  if (treatment.category === 'therapies') {
    return 'Improved mobility and function, but underlying cellular damage continued causing pain';
  }

  // Default
  return 'Provided temporary symptom relief without addressing Primary Cell damage';
};

/**
 * Maps conditions to their associated sensations for display
 * @param conditions - User's conditions
 * @param sensations - User's pain sensations
 * @returns Array of conditions with their sensations
 */
const mapConditionsToSensations = (
  conditions: Array<{ id: string; name: string; category: string }>,
  sensations: Sensation[]
): Array<{
  condition: { id: string; name: string; category: string };
  sensations: Sensation[];
}> => {
  // For this MVP, we'll associate all sensations with all conditions
  // In a more sophisticated version, we could map specific sensations to specific conditions
  return conditions.map((condition) => ({
    condition,
    sensations,
  }));
};
