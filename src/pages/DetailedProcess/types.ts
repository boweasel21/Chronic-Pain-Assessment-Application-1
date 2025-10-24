/**
 * Type definitions for DetailedProcess components
 */

/**
 * Process step interface
 */
export interface ProcessStep {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  details: string[];
  examples: string[];
  timeline: string;
  icon: JSX.Element;
}

/**
 * Benefit interface
 */
export interface Benefit {
  title: string;
  description: string;
  icon: JSX.Element;
}
