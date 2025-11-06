/**
 * Disqualification Page Component
 * Empathetic exit page for users who don't qualify for the program
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAssessmentResponse } from '@context/AssessmentContext';
import { getConditionById } from '@data/conditions';
import { Button } from '@components/common/Button';
import { type AssessmentResponse } from '@types';
import styles from './DisqualificationPage.module.css';

/**
 * Disqualification reasons with explanations
 */
interface DisqualificationReason {
  condition: string;
  explanation: string;
  bodyExplanation: string;
}

/**
 * Maps disqualification reasons to content
 */
const disqualificationReasons: Record<string, DisqualificationReason> = {
  'no-diagnosis': {
    condition: 'No Clinical Diagnosis',
    explanation:
      'Our Cellular Repair Method requires a confirmed diagnosis to create an effective treatment protocol. Without understanding the specific condition, we cannot safely personalize your care.',
    bodyExplanation:
      'Your nervous system may be experiencing sensitization or inflammation patterns that need proper medical evaluation first.',
  },
  'acute-pain': {
    condition: 'Pain Duration Less Than 6 Months',
    explanation:
      'Our Cellular Repair Method works best when chronic patterns have formed. Acute pain (under 6 months) often responds well to conventional treatments and may resolve naturally.',
    bodyExplanation:
      'Your body is still in the acute healing phase. The cellular damage patterns we specialize in treating typically develop after 6+ months of persistent pain.',
  },
  'age-under-18': {
    condition: 'Age Under 18',
    explanation:
      'Our protocols are designed and tested for adult physiology. Pediatric chronic pain requires specialized approaches that account for developmental factors.',
    bodyExplanation:
      'Your body is still developing, and the cellular repair processes work differently in growing tissues. You need specialized pediatric chronic pain care.',
  },
  'autoimmune-disease': {
    condition: 'Autoimmune Disease',
    explanation:
      'Autoimmune-driven pain requires immunological treatment. Our Cellular Repair Method focuses on mechanical cellular damage, not immune dysregulation.',
    bodyExplanation:
      'Your immune system is attacking tissues throughout your body. This requires medical protocols that calm the immune response before cellular repair work can be effective.',
  },
  'chronic-fatigue': {
    condition: 'Chronic Fatigue Syndrome (ME/CFS)',
    explanation:
      'Our research team is actively studying ME/CFS. At this time, we do not have a Primary Cell protocol that delivers consistent outcomes for this condition.',
    bodyExplanation:
      'ME/CFS involves complex immune and metabolic factors that behave differently from mechanical injury patterns. We recommend continuing with specialists focused on ME/CFS research.',
  },
  fibromyalgia: {
    condition: 'Fibromyalgia',
    explanation:
      'Fibromyalgia involves widespread neurological sensitization that we are still researching. We do not currently have a reproducible Primary Cell repair process for this condition.',
    bodyExplanation:
      'Your nervous system is amplifying pain signals globally. Until our research confirms reliable outcomes, we do not want to offer a process that might not relieve your symptoms.',
  },
  'infectious-disease': {
    condition: 'Infectious Disease-Related Pain',
    explanation:
      'Pain linked to active or chronic infections must be stabilized by medical providers who specialize in infectious disease before cellular repair work can begin.',
    bodyExplanation:
      'Your pain is connected to ongoing pathogen activity. Until those pathogens are addressed, cellular repair work will not hold.',
  },
  'traumatic-brain-injury': {
    condition: 'Traumatic Brain Injury (TBI)',
    explanation:
      'We are conducting studies on post-TBI pain patterns. At this time, we do not yet have a Primary Cell repair process for TBI-related pain.',
    bodyExplanation:
      'Brain injuries create complex neurological changes that extend beyond the cellular injury patterns we currently repair.',
  },
  'endocrine-disorder': {
    condition: 'Endocrine Disorders',
    explanation:
      'Hormone-driven pain requires endocrinology support. Once hormone levels are balanced, we can evaluate whether residual pain is cellular.',
    bodyExplanation:
      'Your endocrine system is creating pain through hormonal imbalance. This must be stabilized through medical treatment before we can assess cellular contributions.',
  },
  'gastrointestinal-disorder': {
    condition: 'Gastrointestinal Disorders',
    explanation:
      'Visceral pain connected to GI disorders involves organ and immune interactions outside our current scope. Specialized GI care is required first.',
    bodyExplanation:
      'The pain you are feeling is linked to digestive tract inflammation and immune response. Those systems must be regulated before cellular repair can help.',
  },
  'cancer-pain': {
    condition: 'Cancer-Related Pain',
    explanation:
      'Cancer and cancer-related pain require oncological oversight. Our protocols are not designed to work alongside active cancer treatment.',
    bodyExplanation:
      'Your pain is related to active disease processes that need oncological management first and foremost.',
  },
  'rheumatoid-arthritis': {
    condition: 'Autoimmune Arthritis',
    explanation:
      'Autoimmune-driven joint pain requires immunology support. Once the immune response is stabilized, we can reassess whether cellular repair is appropriate.',
    bodyExplanation:
      'Your immune system is attacking joint tissues. This needs to be addressed with disease-modifying therapies before cellular repair can be effective.',
  },
  'suicidal-risk': {
    condition: 'Your Safety Comes First',
    explanation:
      'If you are experiencing suicidal thoughts, plans, or previous attempts, we want you to get immediate, specialized support. Our process is not designed to address active mental health crises.',
    bodyExplanation:
      'Chronic pain can feel overwhelming. You deserve rapid access to professionals who can help you stay safe while we continue advancing cellular repair options.',
  },
  'non-treatable': {
    condition: 'Non-Treatable Condition',
    explanation:
      'We are sorry. We cannot help this condition. Unfortunately, many chronic pain conditions are associated with diseases and infections caused by pathogens that are beyond our reach.',
    bodyExplanation: '',
  },
  'acute-injury': {
    condition: 'Recent Acute Injury',
    explanation:
      'Fresh injuries (within 3 months) are still in the active healing phase. Our methods work best after the initial healing has completed but pain persists.',
    bodyExplanation:
      'Your tissues are in acute inflammatory healing. This is normal and necessary for recovery. If pain persists beyond 6 months, we may be able to help.',
  },
};

/**
 * Alternative resources for users who don't qualify
 */
interface Resource {
  title: string;
  description: string;
  url: string;
}

/**
 * Gets alternative resources based on disqualification reason
 * @param reason - Disqualification reason
 * @returns Array of relevant resources
 */
const getAlternativeResources = (reason: string): Resource[] => {
  const baseResources: Resource[] = [
    {
      title: 'American Chronic Pain Association',
      description: 'Support groups and resources for chronic pain management',
      url: 'https://www.theacpa.org',
    },
    {
      title: 'Pain Management Best Practices',
      description: 'NIH guidelines for managing chronic pain',
      url: 'https://www.nih.gov/pain',
    },
  ];

  const specificResources: Record<string, Resource[]> = {
    'autoimmune-disease': [
      {
        title: 'Arthritis Foundation',
        description: 'Resources for autoimmune arthritis management',
        url: 'https://www.arthritis.org',
      },
      {
        title: 'Rheumatoid Arthritis Support Network',
        description: 'Community support and treatment information',
        url: 'https://www.rheumatoidarthritis.org',
      },
    ],
    fibromyalgia: [
      {
        title: 'National Fibromyalgia Association',
        description: 'Education, research updates, and support resources',
        url: 'https://www.fmaware.org',
      },
      {
        title: 'Fibromyalgia Support Groups',
        description: 'Peer support communities for managing fibromyalgia',
        url: 'https://www.mayoclinic.org/diseases-conditions/fibromyalgia/in-depth/fibromyalgia-support-groups/art-20335051',
      },
    ],
    'chronic-fatigue': [
      {
        title: 'Solve ME/CFS Initiative',
        description: 'Research-backed resources and patient advocacy for ME/CFS',
        url: 'https://solvecfs.org',
      },
      {
        title: 'ME Association',
        description: 'Support services and research updates for ME/CFS',
        url: 'https://meassociation.org.uk',
      },
    ],
    'infectious-disease': [
      {
        title: 'Centers for Disease Control and Prevention',
        description: 'Guidelines and care recommendations for infectious diseases',
        url: 'https://www.cdc.gov',
      },
      {
        title: 'Infectious Diseases Society of America',
        description: 'Find specialists and up-to-date treatment protocols',
        url: 'https://www.idsociety.org',
      },
    ],
    'traumatic-brain-injury': [
      {
        title: 'Brain Injury Association of America',
        description: 'Support resources and specialists for TBI recovery',
        url: 'https://www.biausa.org',
      },
      {
        title: 'Model Systems Knowledge Translation Center',
        description: 'Evidence-based fact sheets for TBI care',
        url: 'https://msktc.org/tbi',
      },
    ],
    'endocrine-disorder': [
      {
        title: 'Hormone Health Network',
        description: 'Educational resources on endocrine disorders and treatments',
        url: 'https://www.hormone.org',
      },
      {
        title: 'Endocrine Society Patient Resources',
        description: 'Find endocrinologists and patient guides',
        url: 'https://www.endocrine.org/patient-engagement',
      },
    ],
    'gastrointestinal-disorder': [
      {
        title: 'Crohn’s & Colitis Foundation',
        description: 'Support and medical guidance for inflammatory bowel diseases',
        url: 'https://www.crohnscolitisfoundation.org',
      },
      {
        title: 'International Foundation for Gastrointestinal Disorders',
        description: 'Resources for IBS and other functional GI disorders',
        url: 'https://www.iffgd.org',
      },
    ],
    'cancer-pain': [
      {
        title: 'American Cancer Society',
        description: 'Pain management resources for cancer patients',
        url: 'https://www.cancer.org',
      },
      {
        title: 'Cancer Support Community',
        description: 'Support services for cancer patients and families',
        url: 'https://www.cancersupportcommunity.org',
      },
    ],
    'rheumatoid-arthritis': [
      {
        title: 'Arthritis Foundation',
        description: 'Resources for autoimmune arthritis management',
        url: 'https://www.arthritis.org',
      },
      {
        title: 'Rheumatoid Arthritis Support Network',
        description: 'Community support and treatment information',
        url: 'https://www.rheumatoidarthritis.org',
      },
    ],
    'suicidal-risk': [
      {
        title: '988 Suicide & Crisis Lifeline',
        description: 'Call or text 988 (US) to reach trained counselors 24/7',
        url: 'https://988lifeline.org',
      },
      {
        title: 'Crisis Text Line',
        description: 'Text HOME to 741741 (US/Canada) or access global resources',
        url: 'https://www.crisistextline.org',
      },
    ],
    'age-under-18': [
      {
        title: 'Pediatric Pain Management',
        description: 'Specialized resources for childhood chronic pain',
        url: 'https://www.childrenshospital.org/pain',
      },
    ],
  };

  return [...baseResources, ...(specificResources[reason] || [])];
};

/**
 * Animation variants for the page
 */
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

/**
 * Animation variants for staggered children
 */
const containerVariants = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
};

/**
 * Disqualification Page Component
 *
 * @description Empathetic exit page explaining why user doesn't qualify,
 * what's happening in their body, and providing alternative resources.
 *
 * @returns Rendered disqualification page
 */
const DisqualificationPage: React.FC = () => {
  const navigate = useNavigate();
  const response = useAssessmentResponse();

  // Get disqualification reason from context or use default
  const reasonKey = response.disqualificationReason || getDisqualificationReasonKey(response);
  const reasonData: DisqualificationReason =
    disqualificationReasons[reasonKey] || disqualificationReasons['no-diagnosis'];
  const resources = getAlternativeResources(reasonKey);

  /**
   * Handles contact button click
   */
  const handleContact = () => {
    window.location.href = 'mailto:support@cellularrepair.com?subject=Assessment Discussion';
  };

  /**
   * Handles navigation back to start
   */
  const handleRestart = () => {
    navigate('/');
  };

  return (
    <motion.div
      className={styles.page}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.4 }}
    >
      <div className={styles.container}>
        <motion.div
          className={styles.content}
          variants={containerVariants}
          initial="initial"
          animate="animate"
        >
          {/* Headline */}
          <motion.div variants={itemVariants}>
            <h1 className={styles.headline}>We want to be honest with you...</h1>
          </motion.div>

          {/* Main Explanation */}
          <motion.div variants={itemVariants} className={styles.section}>
            <h2 className={styles.subheadline}>
              Based on your responses, our program isn't the right fit right now
            </h2>
            <p className={styles.bodyText}>
              This isn't about the severity of your pain or how much you deserve help. It's
              about matching the right treatment to the right condition.
            </p>
          </motion.div>

          {/* Specific Condition */}
          <motion.div variants={itemVariants} className={styles.conditionCard}>
            <div className={styles.conditionIcon} aria-hidden="true">
              <svg
                width="48"
                height="48"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
                <path
                  d="M24 16v12m0 4v.01"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className={styles.conditionContent}>
              <h3 className={styles.conditionTitle}>{reasonData.condition}</h3>
              <p className={styles.conditionExplanation}>{reasonData.explanation}</p>
            </div>
          </motion.div>

          {/* Body Explanation */}
          {reasonData.bodyExplanation && (
            <motion.div variants={itemVariants} className={styles.section}>
              <h3 className={styles.sectionTitle}>Here's what IS happening in your body...</h3>
              <p className={styles.bodyText}>{reasonData.bodyExplanation}</p>
            </motion.div>
          )}

          {/* Alternative Resources */}
          <motion.div variants={itemVariants} className={styles.section}>
            <h3 className={styles.sectionTitle}>Resources that may help you</h3>
            <div className={styles.resourceGrid}>
              {resources.map((resource, index) => (
                <a
                  key={index}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.resourceCard}
                  aria-label={`Visit ${resource.title} (opens in new window)`}
                >
                  <h4 className={styles.resourceTitle}>{resource.title}</h4>
                  <p className={styles.resourceDescription}>{resource.description}</p>
                  <span className={styles.resourceLink} aria-hidden="true">
                    Visit resource →
                  </span>
                </a>
              ))}
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div variants={itemVariants} className={styles.actions}>
            <Button
              variant="primary"
              size="large"
              onClick={handleContact}
              aria-label="Contact us to discuss your situation"
              fullWidth
            >
              Contact Us to Discuss
            </Button>
            <Button
              variant="secondary"
              size="large"
              onClick={handleRestart}
              aria-label="Return to assessment start"
              fullWidth
            >
              Return to Start
            </Button>
          </motion.div>

          {/* Closing Message */}
          <motion.div variants={itemVariants} className={styles.closingMessage}>
            <p className={styles.bodyText}>
              We genuinely wish we could help everyone in pain. Our specialization means we
              can deliver exceptional results for specific conditions—but it also means we
              need to be honest when we're not the right fit.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

/**
 * Determines disqualification reason key from assessment response
 * @param response - Assessment response data
 * @returns Disqualification reason key
 */
function getDisqualificationReasonKey(response: AssessmentResponse): string {
  if (!response.hasClinicalDiagnosis) {
    return 'no-diagnosis';
  }

  if (response.painDuration !== null && response.painDuration < 6) {
    return 'acute-pain';
  }

  if (response.ageRange === 'under-18') {
    return 'age-under-18';
  }

  if (response.suicidalRiskAnswer === 'yes') {
    return 'suicidal-risk';
  }

  if (response.conditionType === 'rheumatoid-arthritis' || response.conditionType === 'cancer-pain') {
    return response.conditionType;
  }

  if (response.conditionType) {
    const condition = getConditionById(response.conditionType);
    if (condition?.category === 'non-treatable') {
      if (disqualificationReasons[response.conditionType]) {
        return response.conditionType;
      }
      return 'non-treatable';
    }
  }

  // Default fallback
  return 'no-diagnosis';
}

export default DisqualificationPage;
