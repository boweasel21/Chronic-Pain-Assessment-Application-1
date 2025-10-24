/**
 * MainContent Component
 *
 * @description Semantic main content wrapper component that provides proper
 * landmark structure for assistive technologies and manages focus for keyboard
 * navigation. This component should wrap the primary content of each page.
 *
 * Features:
 * - Semantic <main> HTML5 landmark
 * - Programmatically focusable via tabIndex={-1}
 * - Removes visual focus outline (but maintains programmatic focus)
 * - Proper ARIA roles and labels
 * - Integrates with skip links
 * - Supports custom styling and class names
 *
 * Accessibility Benefits:
 * - Screen readers can jump directly to main content
 * - Keyboard users can skip repetitive navigation
 * - Proper document structure for AT navigation
 * - Focus management after route changes
 *
 * @module components/layout/MainContent
 */

import React, { ReactNode } from 'react';

/**
 * MainContent component props interface
 */
export interface MainContentProps {
  /**
   * Child elements to render inside the main content area
   */
  children: ReactNode;

  /**
   * Custom ID for the main content element
   * Used for skip links and focus management
   * @default 'main-content'
   */
  id?: string;

  /**
   * Optional CSS class name for custom styling
   */
  className?: string;

  /**
   * Optional inline styles
   */
  style?: React.CSSProperties;

  /**
   * Accessible label for the main content region
   * Announced by screen readers when navigating landmarks
   */
  'aria-label'?: string;

  /**
   * ID of an element that labels this main content
   * Alternative to aria-label
   */
  'aria-labelledby'?: string;
}

/**
 * MainContent Component
 *
 * @description Wrapper component for main page content. Provides semantic HTML5
 * main landmark with proper accessibility attributes for screen readers and
 * keyboard navigation. Must be used within each page component for consistent
 * focus management and accessibility.
 *
 * Important Notes:
 * - There should only be ONE <main> element per page
 * - The tabIndex={-1} allows programmatic focus but excludes from tab order
 * - The outline: 'none' style removes visual focus indicator
 * - Use this in conjunction with usePageFocus() hook
 *
 * @example
 * Basic usage:
 * ```tsx
 * import { MainContent } from '@components/layout/MainContent';
 * import { usePageFocus } from '@hooks/useAccessibility';
 *
 * const MyPage = () => {
 *   usePageFocus('main-content');
 *
 *   return (
 *     <MainContent>
 *       <h1>Page Title</h1>
 *       <p>Page content...</p>
 *     </MainContent>
 *   );
 * };
 * ```
 *
 * @example
 * With custom ID and label:
 * ```tsx
 * <MainContent
 *   id="article-content"
 *   aria-label="Article content"
 *   className="custom-main"
 * >
 *   <article>...</article>
 * </MainContent>
 * ```
 *
 * @example
 * With custom styles:
 * ```tsx
 * <MainContent
 *   style={{
 *     padding: '2rem',
 *     maxWidth: '1200px',
 *     margin: '0 auto'
 *   }}
 * >
 *   {children}
 * </MainContent>
 * ```
 *
 * @param {MainContentProps} props - Component props
 * @returns {JSX.Element} Rendered main content element
 */
export const MainContent: React.FC<MainContentProps> = ({
  children,
  id = 'main-content',
  className = '',
  style = {},
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby
}): JSX.Element => {
  /**
   * Default styles for main content
   * Ensures outline is removed for programmatic focus
   */
  const defaultStyles: React.CSSProperties = {
    outline: 'none',
    ...style
  };

  return (
    <main
      id={id}
      className={className}
      style={defaultStyles}
      tabIndex={-1}
      role="main"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
    >
      {children}
    </main>
  );
};

/**
 * Default export for convenience
 */
export default MainContent;
