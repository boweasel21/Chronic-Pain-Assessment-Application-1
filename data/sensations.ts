/**
 * Pain sensation data definitions for Primary Cell Assessment
 * Maps different types of pain sensations users may experience
 */

export interface Sensation {
  id: string;
  name: string;
  description: string;
}

export const SENSATIONS: readonly Sensation[] = [
  {
    id: 'sharp-stabbing',
    name: 'Sharp or stabbing or shooting pain',
    description: 'Feels like a knife, needle, or electric jolt.',
  },
  {
    id: 'burning',
    name: 'Burning pain',
    description: 'Feels hot, fiery, or like being scalded.',
  },
  {
    id: 'radiating',
    name: 'Pain that radiates down your arm/leg or across your body',
    description: '',
  },
  {
    id: 'aching',
    name: 'Persistent dull aching pain',
    description: "Feels like a deep, constant soreness or heaviness that just doesn't go away.",
  },
  {
    id: 'tingling',
    name: 'Tingling or numbness ("pins-and-needles") or loss of feeling',
    description: '',
  },
  {
    id: 'muscle-tightness',
    name: 'Muscle tightness or spasms or cramps',
    description: 'Constant or sudden, tightening or knotting feeling.',
  },
  {
    id: 'stiffness',
    name: 'Stiffness in joints or spine',
    description: 'Hard to move, especially upon waking or after sitting.',
  },
  {
    id: 'tenderness',
    name: 'Tenderness or sensitivity to touch or movement',
    description: 'Hurts when touched or with movement.',
  },
  {
    id: 'movement-pain',
    name: 'Pain when you move',
    description: 'Intensifies when you bend, twist, walk, stand, or sit.',
  },
] as const;

export type SensationId = typeof SENSATIONS[number]['id'];

/**
 * Get sensation by ID
 */
export const getSensationById = (id: string): Sensation | undefined => {
  return SENSATIONS.find((sensation) => sensation.id === id);
};

/**
 * Get sensations by multiple IDs
 */
export const getSensationsByIds = (ids: string[]): Sensation[] => {
  return ids
    .map((id) => getSensationById(id))
    .filter((sensation): sensation is Sensation => sensation !== undefined);
};

/**
 * Check if sensation exists
 */
export const isValidSensationId = (id: string): boolean => {
  return SENSATIONS.some((sensation) => sensation.id === id);
};
