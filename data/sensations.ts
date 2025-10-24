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
    id: 'burning',
    name: 'Burning',
    description: 'A hot, searing sensation often associated with nerve damage or inflammation',
  },
  {
    id: 'tingling',
    name: 'Tingling or Numbness',
    description: 'Pins and needles sensation or loss of feeling, indicating nerve dysfunction',
  },
  {
    id: 'sharp-stabbing',
    name: 'Sharp or Stabbing',
    description: 'Sudden, intense pain that feels like being cut or stabbed',
  },
  {
    id: 'aching',
    name: 'Deep Aching',
    description: 'Persistent, dull pain deep within muscles or joints',
  },
  {
    id: 'throbbing',
    name: 'Throbbing or Pulsing',
    description: 'Rhythmic pain that beats in time with your pulse',
  },
  {
    id: 'shooting',
    name: 'Shooting or Radiating',
    description: 'Pain that travels along nerve pathways, often down limbs',
  },
  {
    id: 'cramping',
    name: 'Cramping or Spasms',
    description: 'Involuntary muscle contractions causing tightness and pain',
  },
  {
    id: 'electric',
    name: 'Electric Shock-like',
    description: 'Brief, intense jolts of pain resembling electrical shocks',
  },
  {
    id: 'pressure',
    name: 'Pressure or Squeezing',
    description: 'Sensation of being compressed or tightly bound',
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
