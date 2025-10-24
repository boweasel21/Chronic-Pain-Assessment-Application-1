/**
 * PageContainer Component
 *
 * @description Convenience wrapper component that combines MainContent with
 * automatic focus management. Use this component at the root of page components
 * to ensure proper accessibility without manually calling usePageFocus.
 *
 * Features:
 * - Automatic focus management on mount
 * - Semantic main content wrapper
 * - Programmatically focusable
 * - Respects prefers-reduced-motion for scroll behavior
 *
 * @module components/common/PageContainer
 */

import React, { ReactNode } from 'react';
import { usePageFocus } from '@hooks/useAccessibility';
import MainContent, { MainContentProps } from '@components/layout/MainContent';

/**
 * PageContainer component props interface
 */
export interface PageContainerProps extends Omit<MainContentProps, 'children'> {
  /**
   * Child elements to render inside the page container
   */
  children: ReactNode;
}

/**
 * PageContainer Component
 *
 * @description Wraps page content with MainContent component and automatically
 * manages focus on page mount. This is the recommended wrapper for all page
 * components in the application for consistent accessibility.
 *
 * Usage Guidelines:
 * - Use at the root level of each page component
 * - Only one PageContainer per page
 * - Place immediately inside page function component
 * - Do not nest PageContainers
 *
 * @example
 * Basic usage in a page component:
 * ```tsx
 * import { PageContainer } from '@components/common/PageContainer';
 *
 * const MyPage: React.FC = () => {
 *   return (
 *     <PageContainer>
 *       <h1>Page Title</h1>
 *       <p>Page content...</p>
 *     </PageContainer>
 *   );
 * };
 * ```
 *
 * @example
 * With custom props:
 * ```tsx
 * <PageContainer
 *   id="custom-main"
 *   aria-label="Article content"
 *   className="custom-page"
 * >
 *   {content}
 * </PageContainer>
 * ```
 *
 * @param {PageContainerProps} props - Component props
 * @returns {JSX.Element} Rendered page container element
 */
export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  id = 'main-content',
  ...rest
}) => {
  // Automatically focus main content on page mount
  usePageFocus(id);

  return (
    <MainContent id={id} {...rest}>
      {children}
    </MainContent>
  );
};

/**
 * Default export
 */
export default PageContainer;
