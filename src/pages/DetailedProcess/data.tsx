/**
 * Data for DetailedProcess components
 * Process steps and benefits data
 */

import { ProcessStep, Benefit } from './types';

/**
 * Process steps data
 */
export const processSteps: ProcessStep[] = [
  {
    id: 1,
    title: 'Identify the 9 Types of Cellular Damage',
    subtitle: 'Comprehensive Assessment',
    description:
      'Standard medicine looks for structural damage on scans. We look deeper—at the 9 types of cellular dysfunction that scans can\'t detect.',
    details: [
      'Mitochondrial dysfunction (energy production failure)',
      'Membrane damage (cell communication breakdown)',
      'Ion channel disruption (electrical signaling errors)',
      'Inflammatory cascade activation',
      'Oxidative stress accumulation',
      'Neurotransmitter imbalances',
      'Tissue hypoxia (oxygen deprivation)',
      'Metabolic waste buildup',
      'Nerve sensitization patterns',
    ],
    examples: [
      'Your MRI shows "normal" but cells aren\'t producing energy correctly',
      'Nerves fire constantly because ion channels are stuck "on"',
      'Tissues can\'t heal because they\'re oxygen-starved',
    ],
    timeline: 'Initial Assessment: 2-3 hours',
    icon: (
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="2" />
        <path
          d="M24 14v20m-10-10h20"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: 2,
    title: 'Assess Your Unique Damage Pattern',
    subtitle: 'Personalized Mapping',
    description:
      'No two chronic pain patients have the same damage pattern. We create a detailed map of YOUR specific cellular dysfunction.',
    details: [
      'Which of the 9 damage types are present in your case',
      'How severe each type of damage is',
      'Which tissues and nerve pathways are affected',
      'How damage types interact in your body',
      'Priority order for repair protocols',
      'Expected response timeline based on your pattern',
    ],
    examples: [
      'Patient A: Primary mitochondrial + membrane damage = 8 week protocol',
      'Patient B: Ion channel + inflammatory cascade = 12 week protocol',
      'Your pattern determines your personalized treatment roadmap',
    ],
    timeline: 'Analysis & Protocol Design: 1 week',
    icon: (
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8 24h10m6 0h10m-6 0h10M14 14l5 5m10-5l-5 5m0 10l5 5m-20 0l5-5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: 3,
    title: 'Apply Our Proprietary Repair Protocols',
    subtitle: 'Active Cellular Repair',
    description:
      'This is where the magic happens. We use targeted techniques to repair each type of cellular damage in the correct sequence.',
    details: [
      'Restore mitochondrial ATP production',
      'Repair damaged cell membranes',
      'Reset malfunctioning ion channels',
      'Resolve chronic inflammation at the cellular level',
      'Clear oxidative stress and metabolic waste',
      'Rebalance neurotransmitter systems',
      'Restore tissue oxygenation',
      'Reprogram sensitized nerve pathways',
      'Optimize cellular communication',
    ],
    examples: [
      'Week 1-2: Energy production restored, less fatigue',
      'Week 3-4: Inflammation reduced, swelling decreases',
      'Week 5-8: Pain signals normalize, function returns',
      'Week 9-12: Sustained improvement, life restored',
    ],
    timeline: '8-16 weeks of active treatment',
    icon: (
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M24 8v32m0-32a8 8 0 018 8v16a8 8 0 01-16 0V16a8 8 0 018-8z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: 4,
    title: 'Monitor & Adjust for Complete Recovery',
    subtitle: 'Continuous Optimization',
    description:
      'Healing isn\'t linear. We continuously monitor your progress and adjust protocols to ensure complete, lasting recovery.',
    details: [
      'Weekly progress assessments',
      'Real-time protocol adjustments based on your response',
      'Addressing any remaining damage patterns',
      'Optimization of results',
      'Prevention of recurrence',
      'Long-term maintenance strategies',
    ],
    examples: [
      'You plateau at week 6? We identify remaining damage and adjust',
      'You progress faster? We accelerate the protocol',
      'New symptoms emerge? We address underlying causes',
    ],
    timeline: 'Ongoing support through recovery + 6-month follow-up',
    icon: (
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4 4 12.954 4 24s8.954 20 20 20z"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M16 24l4 4 8-8"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

/**
 * Benefits data
 */
export const benefits: Benefit[] = [
  {
    title: 'Pain Relief',
    description: 'Dramatic reduction in pain levels as cellular damage is repaired',
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M16 28c6.627 0 12-5.373 12-12S22.627 4 16 4 4 9.373 4 16s5.373 12 12 12z"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path d="M10 16l3 3 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Movement Restoration',
    description: 'Return to activities you thought you\'d lost forever',
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8 20l8-8 8 8M8 12h16"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: 'Energy Improvement',
    description: 'Restored mitochondrial function means real, sustained energy',
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M18 4l-10 14h10l-2 10 10-14H16l2-10z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: 'Sleep Quality',
    description: 'Proper cellular repair allows your body to truly rest and recover',
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M16 6a10 10 0 1010 10c0-5.523-4.477-10-10-10z"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
    ),
  },
  {
    title: 'Emotional Wellbeing',
    description: 'Reduced pain and restored function transform mental health',
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="2" />
        <path d="M12 14v2m8-2v2m-8 4c2 2 6 2 8 0" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
  },
];
