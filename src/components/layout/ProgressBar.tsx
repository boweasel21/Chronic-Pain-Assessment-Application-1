/**
 * Progress Bar Component
 * Visual indicator of assessment completion progress
 */

import React from 'react';

/**
 * Progress bar props
 */
interface ProgressBarProps {
  /**
   * Current step number (1-based)
   */
  current: number;
  /**
   * Total number of steps
   */
  total: number;
  /**
   * Optional custom height in pixels
   * @default 8
   */
  height?: number;
  /**
   * Optional custom color for filled portion
   * @default var(--color-primary-navy)
   */
  color?: string;
  /**
   * Optional custom background color
   * @default var(--color-gray-200)
   */
  backgroundColor?: string;
  /**
   * Whether to show percentage text
   * @default false
   */
  showPercentage?: boolean;
}

/**
 * Progress Bar Component
 * Displays assessment progress with WCAG AA accessibility
 *
 * @param props - Component props
 * @returns Progress bar component
 */
const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  total,
  height = 8,
  color = 'var(--color-primary-navy)',
  backgroundColor = 'var(--color-gray-200)',
  showPercentage = false,
}) => {
  // Calculate progress percentage
  const percentage = Math.min(Math.max((current / total) * 100, 0), 100);
  const formattedPercentage = Math.round(percentage);

  // Ensure valid values
  if (total <= 0) {
    throw new Error('ProgressBar: total must be greater than 0');
  }

  if (current < 0) {
    throw new Error('ProgressBar: current cannot be negative');
  }

  return (
    <div style={styles.container}>
      {/* Progress bar track */}
      <div
        style={{
          ...styles.track,
          height: `${height}px`,
          backgroundColor,
        }}
        role="progressbar"
        aria-valuenow={formattedPercentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Assessment progress: ${formattedPercentage}% complete`}
      >
        {/* Progress bar fill */}
        <div
          style={{
            ...styles.fill,
            width: `${percentage}%`,
            backgroundColor: color,
            transition: 'width var(--transition-slow) var(--transition-timing)',
          }}
        />
      </div>

      {/* Optional percentage text */}
      {showPercentage && (
        <div style={styles.percentageContainer}>
          <span style={styles.percentageText} aria-hidden="true">
            {formattedPercentage}%
          </span>
        </div>
      )}

      {/* Screen reader announcement */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Step {current} of {total} complete. {formattedPercentage}% progress.
      </div>
    </div>
  );
};

/**
 * Component styles
 */
const styles: Record<string, React.CSSProperties> = {
  container: {
    width: '100%',
    position: 'relative',
  },

  track: {
    width: '100%',
    borderRadius: 'var(--radius-full)',
    overflow: 'hidden',
    position: 'relative',
  },

  fill: {
    height: '100%',
    borderRadius: 'var(--radius-full)',
    position: 'relative',
  },

  percentageContainer: {
    marginTop: 'var(--spacing-xs)',
    display: 'flex',
    justifyContent: 'flex-end',
  },

  percentageText: {
    fontSize: '0.875rem',
    fontWeight: 600,
    color: 'var(--color-primary-navy)',
  },
};

export default ProgressBar;
