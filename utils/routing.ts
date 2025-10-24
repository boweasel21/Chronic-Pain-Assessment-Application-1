/**
 * Routing utility functions for Primary Cell Assessment
 * Handles page navigation logic including conditional routing and disqualification
 */

import { PAGES } from './constants';
import { getConditionById } from '../data/conditions';

/**
 * Assessment responses interface (subset needed for routing)
 */
export interface RoutingResponses {
  conditions?: string[];
  hasBudget?: boolean;
}

/**
 * Page routing map - defines the linear flow
 */
export const PAGE_FLOW: readonly string[] = [
  PAGES.WELCOME,
  PAGES.PAGE_1,
  PAGES.PAGE_2,
  PAGES.PAGE_3,
  PAGES.PAGE_4,
  PAGES.PAGE_5,
  PAGES.PAGE_6,
  // PAGE_6B is conditional
  PAGES.PAGE_7,
  PAGES.PAGE_8,
  PAGES.PAGE_9,
  PAGES.PAGE_10,
  PAGES.PAGE_11,
  PAGES.THANK_YOU,
] as const;

/**
 * Checks if user should be disqualified (only selected non-treatable conditions)
 * @param responses - Current assessment responses
 * @returns True if user should be sent to waiting list
 */
export const shouldDisqualify = (responses: RoutingResponses): boolean => {
  const { conditions } = responses;

  if (!conditions || conditions.length === 0) {
    return false;
  }

  // Check if ALL selected conditions are non-treatable
  const allNonTreatable = conditions.every((conditionId) => {
    const condition = getConditionById(conditionId);
    return condition?.category === 'non-treatable';
  });

  return allNonTreatable;
};

/**
 * Gets the next page in the flow based on current page and responses
 * @param currentPage - Current page path
 * @param responses - Current assessment responses
 * @returns Next page path
 */
export const getNextPage = (
  currentPage: string,
  responses: RoutingResponses = {}
): string => {
  // Handle disqualification check after Page 1 (condition selection)
  if (currentPage === PAGES.PAGE_1) {
    if (shouldDisqualify(responses)) {
      return PAGES.WAITING_LIST;
    }
  }

  // Handle conditional budget routing from Page 6
  if (currentPage === PAGES.PAGE_6) {
    // If user has budget, go to Page 6B (budget range)
    if (responses.hasBudget === true) {
      return PAGES.PAGE_6B;
    }
    // If user has no budget, skip to Page 7
    if (responses.hasBudget === false) {
      return PAGES.PAGE_7;
    }
    // If hasBudget is undefined, stay on Page 6 (shouldn't happen with validation)
    return PAGES.PAGE_6;
  }

  // Handle Page 6B routing (always goes to Page 7)
  if (currentPage === PAGES.PAGE_6B) {
    return PAGES.PAGE_7;
  }

  // Handle waiting list (terminal page)
  if (currentPage === PAGES.WAITING_LIST) {
    return PAGES.WAITING_LIST;
  }

  // Handle thank you page (terminal page)
  if (currentPage === PAGES.THANK_YOU) {
    return PAGES.THANK_YOU;
  }

  // Standard linear flow
  const currentIndex = PAGE_FLOW.indexOf(currentPage);

  if (currentIndex === -1) {
    // Unknown page, return welcome
    return PAGES.WELCOME;
  }

  if (currentIndex === PAGE_FLOW.length - 1) {
    // Already at last page
    return currentPage;
  }

  return PAGE_FLOW[currentIndex + 1];
};

/**
 * Gets the previous page in the flow
 * @param currentPage - Current page path
 * @returns Previous page path
 */
export const getPreviousPage = (currentPage: string): string => {
  // Handle Page 6B - should go back to Page 6
  if (currentPage === PAGES.PAGE_6B) {
    return PAGES.PAGE_6;
  }

  // Handle Page 7 - could come from Page 6 or Page 6B
  // Default to Page 6 for back navigation
  if (currentPage === PAGES.PAGE_7) {
    return PAGES.PAGE_6;
  }

  // Terminal pages - no back navigation
  if (currentPage === PAGES.WAITING_LIST || currentPage === PAGES.THANK_YOU) {
    return currentPage;
  }

  // Standard linear flow
  const currentIndex = PAGE_FLOW.indexOf(currentPage);

  if (currentIndex === -1 || currentIndex === 0) {
    // Unknown page or first page
    return PAGES.WELCOME;
  }

  return PAGE_FLOW[currentIndex - 1];
};

/**
 * Checks if a page is accessible based on current progress
 * @param targetPage - Page to check accessibility for
 * @param completedPages - Array of completed page paths
 * @returns True if page is accessible
 */
export const isPageAccessible = (
  targetPage: string,
  completedPages: string[] = []
): boolean => {
  // Welcome page is always accessible
  if (targetPage === PAGES.WELCOME) {
    return true;
  }

  // Find the target page in the flow
  const targetIndex = PAGE_FLOW.indexOf(targetPage);

  if (targetIndex === -1) {
    // Unknown page
    return false;
  }

  // Check if all previous pages in the flow have been completed
  for (let i = 0; i < targetIndex; i++) {
    const requiredPage = PAGE_FLOW[i];
    if (!completedPages.includes(requiredPage)) {
      return false;
    }
  }

  return true;
};

/**
 * Gets the page number for display (1-based index)
 * @param currentPage - Current page path
 * @returns Page number for display, or null if not applicable
 */
export const getPageNumber = (currentPage: string): number | null => {
  // Pages that don't have numbers
  const unnumberedPages = [
    PAGES.WELCOME,
    PAGES.WAITING_LIST,
    PAGES.THANK_YOU,
  ];

  if (unnumberedPages.includes(currentPage)) {
    return null;
  }

  // Handle Page 6B separately (counts as same step as Page 6)
  if (currentPage === PAGES.PAGE_6B) {
    return 6;
  }

  // Extract page number from path
  const match = currentPage.match(/page-(\d+)/);
  if (match && match[1]) {
    return parseInt(match[1], 10);
  }

  // Results page is the final numbered page (11)
  if (currentPage === PAGES.PAGE_11) {
    return 11;
  }

  return null;
};

/**
 * Gets the total number of pages in the assessment
 * @param responses - Current assessment responses (for conditional pages)
 * @returns Total page count
 */
export const getTotalPages = (responses: RoutingResponses = {}): number => {
  // Base count is 11 (Welcome + Pages 1-10 + Results)
  // Page 6B is conditional and doesn't add to the count (it's part of step 6)
  return PAGES.TOTAL_COUNT;
};

/**
 * Gets the progress percentage
 * @param currentPage - Current page path
 * @param responses - Current assessment responses
 * @returns Progress percentage (0-100)
 */
export const getProgressPercentage = (
  currentPage: string,
  responses: RoutingResponses = {}
): number => {
  const pageNumber = getPageNumber(currentPage);

  if (pageNumber === null) {
    // Welcome page or terminal pages
    if (currentPage === PAGES.WELCOME) {
      return 0;
    }
    if (currentPage === PAGES.WAITING_LIST || currentPage === PAGES.THANK_YOU) {
      return 100;
    }
    return 0;
  }

  const totalPages = getTotalPages(responses);
  const percentage = Math.round((pageNumber / totalPages) * 100);

  return Math.min(100, Math.max(0, percentage));
};

/**
 * Checks if current page is the first page
 * @param currentPage - Current page path
 * @returns True if first page
 */
export const isFirstPage = (currentPage: string): boolean => {
  return currentPage === PAGES.WELCOME || currentPage === PAGES.PAGE_1;
};

/**
 * Checks if current page is the last page
 * @param currentPage - Current page path
 * @returns True if last page
 */
export const isLastPage = (currentPage: string): boolean => {
  return (
    currentPage === PAGES.PAGE_11 ||
    currentPage === PAGES.THANK_YOU ||
    currentPage === PAGES.WAITING_LIST
  );
};

/**
 * Gets all valid page paths
 * @returns Array of all valid page paths
 */
export const getAllPages = (): string[] => {
  return [
    ...PAGE_FLOW,
    PAGES.PAGE_6B,
    PAGES.WAITING_LIST,
  ];
};
