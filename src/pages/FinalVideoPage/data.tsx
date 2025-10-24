/**
 * Data for FinalVideoPage components
 * FAQ items and expectation items
 */

import { FAQItem, ExpectItem } from './types';

/**
 * FAQ data
 */
export const faqItems: FAQItem[] = [
  {
    question: 'What should I prepare for the discovery call?',
    answer: 'Come prepared with a list of your current symptoms, any relevant medical records, and questions about the Cellular Repair Process. We\'ll guide you through everything else.',
  },
  {
    question: 'How long is the discovery call?',
    answer: 'The discovery call typically lasts 30 minutes. We\'ll assess your specific situation, answer your questions, and determine if our Cellular Repair Process is right for you.',
  },
  {
    question: 'What happens after the discovery call?',
    answer: 'If we\'re a good fit, we\'ll create a personalized treatment plan tailored to your specific pain pattern and cellular damage. You\'ll receive a detailed roadmap for your recovery journey.',
  },
  {
    question: 'Is there any cost for the discovery call?',
    answer: 'No, the discovery call is completely free. It\'s an opportunity for us to understand your needs and for you to learn more about how we can help address your chronic pain at the cellular level.',
  },
];

/**
 * What to Expect items data
 */
export const expectItems: ExpectItem[] = [
  {
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: '30-Minute Discovery Call',
    text: 'A focused conversation about your specific pain challenges and health goals',
  },
  {
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: 'Personalized Assessment',
    text: 'In-depth analysis of your pain patterns and cellular damage indicators',
  },
  {
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: 'Custom Treatment Plan',
    text: 'Detailed recommendations tailored to your unique cellular repair needs',
  },
  {
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M13 7l5 5m0 0l-5 5m5-5H6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: 'Next Steps Discussion',
    text: 'Clear roadmap for moving forward with your cellular pain relief journey',
  },
];
