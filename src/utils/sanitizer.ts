/**
 * Input Sanitization Utility
 * Provides comprehensive sanitization functions to prevent XSS attacks
 * and ensure data integrity throughout the application.
 */

import DOMPurify from 'dompurify';

/**
 * Sanitization configuration options
 */
interface SanitizationOptions {
  /**
   * Maximum allowed length for the sanitized string
   */
  maxLength?: number;
  /**
   * Whether to trim whitespace from start and end
   * @default true
   */
  trim?: boolean;
  /**
   * Whether to allow basic formatting (for textareas)
   * @default false
   */
  allowFormatting?: boolean;
}

/**
 * Default DOMPurify configuration for strict text sanitization
 */
const STRICT_CONFIG: DOMPurify.Config = {
  ALLOWED_TAGS: [],
  ALLOWED_ATTR: [],
  KEEP_CONTENT: true,
  RETURN_TRUSTED_TYPE: false,
};

/**
 * DOMPurify configuration for textarea content (preserves line breaks)
 */
const TEXTAREA_CONFIG: DOMPurify.Config = {
  ALLOWED_TAGS: ['br'],
  ALLOWED_ATTR: [],
  KEEP_CONTENT: true,
  RETURN_TRUSTED_TYPE: false,
};

/**
 * Sanitizes general text input to prevent XSS attacks
 *
 * @description Removes all HTML tags and dangerous characters while preserving
 * the text content. Uses DOMPurify for comprehensive XSS protection.
 *
 * @param {string} value - The input string to sanitize
 * @param {SanitizationOptions} options - Optional sanitization configuration
 * @returns {string} Sanitized string safe for display and storage
 *
 * @example
 * ```typescript
 * const userInput = "<script>alert('xss')</script>Hello";
 * const safe = sanitizeInput(userInput);
 * // Returns: "Hello"
 * ```
 */
export const sanitizeInput = (
  value: string,
  options: SanitizationOptions = {}
): string => {
  if (typeof value !== 'string') {
    return '';
  }

  const { maxLength, trim = true, allowFormatting = false } = options;

  try {
    let sanitized = DOMPurify.sanitize(value, allowFormatting ? TEXTAREA_CONFIG : STRICT_CONFIG);

    if (trim) {
      sanitized = sanitized.trim();
    }

    if (maxLength && sanitized.length > maxLength) {
      sanitized = sanitized.substring(0, maxLength);
    }

    return sanitized;
  } catch (error) {
    return '';
  }
};

/**
 * Sanitizes email addresses
 *
 * @description Removes dangerous characters while preserving valid email format.
 * Strips HTML tags and special characters that could be used for injection attacks.
 *
 * @param {string} email - The email address to sanitize
 * @returns {string} Sanitized email address
 *
 * @example
 * ```typescript
 * const email = "user@example.com<script>alert('xss')</script>";
 * const safe = sanitizeEmail(email);
 * // Returns: "user@example.com"
 * ```
 */
export const sanitizeEmail = (email: string): string => {
  if (typeof email !== 'string') {
    return '';
  }

  try {
    let sanitized = DOMPurify.sanitize(email, STRICT_CONFIG);
    sanitized = sanitized.trim();
    sanitized = sanitized.replace(/[<>'"]/g, '');

    return sanitized;
  } catch (error) {
    return '';
  }
};

/**
 * Sanitizes phone numbers
 *
 * @description Removes all non-numeric characters except common phone formatting
 * characters (spaces, hyphens, parentheses, plus sign). Prevents injection attacks.
 *
 * @param {string} phone - The phone number to sanitize
 * @returns {string} Sanitized phone number
 *
 * @example
 * ```typescript
 * const phone = "(555) 123-4567<script>alert('xss')</script>";
 * const safe = sanitizePhone(phone);
 * // Returns: "(555) 123-4567"
 * ```
 */
export const sanitizePhone = (phone: string): string => {
  if (typeof phone !== 'string') {
    return '';
  }

  try {
    let sanitized = DOMPurify.sanitize(phone, STRICT_CONFIG);
    sanitized = sanitized.trim();
    sanitized = sanitized.replace(/[^\d\s\-\+\(\)]/g, '');

    return sanitized;
  } catch (error) {
    return '';
  }
};

/**
 * Sanitizes name input
 *
 * @description Removes HTML tags and restricts input to letters, spaces, hyphens,
 * and apostrophes. Prevents XSS while allowing valid name characters.
 *
 * @param {string} name - The name to sanitize
 * @param {number} maxLength - Maximum allowed length (default: 100)
 * @returns {string} Sanitized name
 *
 * @example
 * ```typescript
 * const name = "John O'Brien<script>alert('xss')</script>";
 * const safe = sanitizeName(name);
 * // Returns: "John O'Brien"
 * ```
 */
export const sanitizeName = (name: string, maxLength: number = 100): string => {
  if (typeof name !== 'string') {
    return '';
  }

  try {
    let sanitized = DOMPurify.sanitize(name, STRICT_CONFIG);
    sanitized = sanitized.trim();
    sanitized = sanitized.replace(/[^a-zA-Z\s\-']/g, '');

    if (sanitized.length > maxLength) {
      sanitized = sanitized.substring(0, maxLength);
    }

    return sanitized;
  } catch (error) {
    return '';
  }
};

/**
 * Sanitizes textarea content
 *
 * @description Sanitizes multi-line text input while preserving line breaks.
 * Removes HTML tags except <br> and enforces maximum length.
 *
 * @param {string} text - The text content to sanitize
 * @param {number} maxLength - Maximum allowed length (default: 1000)
 * @returns {string} Sanitized text content
 *
 * @example
 * ```typescript
 * const text = "Line 1\nLine 2<script>alert('xss')</script>";
 * const safe = sanitizeText(text, 1000);
 * // Returns: "Line 1\nLine 2"
 * ```
 */
export const sanitizeText = (text: string, maxLength: number = 1000): string => {
  if (typeof text !== 'string') {
    return '';
  }

  try {
    let sanitized = DOMPurify.sanitize(text, TEXTAREA_CONFIG);
    sanitized = sanitized.replace(/<br\s*\/?>/gi, '\n');
    sanitized = sanitized.trim();

    if (sanitized.length > maxLength) {
      sanitized = sanitized.substring(0, maxLength);
    }

    return sanitized;
  } catch (error) {
    return '';
  }
};

/**
 * Sanitizes HTML content for display
 *
 * @description Advanced sanitization for HTML content that needs to be displayed.
 * Allows safe HTML tags while removing dangerous scripts and attributes.
 *
 * @param {string} html - The HTML content to sanitize
 * @returns {string} Sanitized HTML safe for display
 *
 * @example
 * ```typescript
 * const html = "<p>Safe content</p><script>alert('xss')</script>";
 * const safe = sanitizeHTML(html);
 * // Returns: "<p>Safe content</p>"
 * ```
 */
export const sanitizeHTML = (html: string): string => {
  if (typeof html !== 'string') {
    return '';
  }

  try {
    const config: DOMPurify.Config = {
      ALLOWED_TAGS: ['p', 'br', 'b', 'i', 'em', 'strong', 'a', 'ul', 'ol', 'li'],
      ALLOWED_ATTR: ['href', 'target', 'rel'],
      ALLOW_DATA_ATTR: false,
      RETURN_TRUSTED_TYPE: false,
    };

    return DOMPurify.sanitize(html, config);
  } catch (error) {
    return '';
  }
};

/**
 * Sanitizes URL input
 *
 * @description Validates and sanitizes URL input, ensuring only safe protocols
 * (http, https) are allowed. Prevents javascript: and data: URL injection.
 *
 * @param {string} url - The URL to sanitize
 * @returns {string} Sanitized URL or empty string if invalid
 *
 * @example
 * ```typescript
 * const url = "javascript:alert('xss')";
 * const safe = sanitizeURL(url);
 * // Returns: ""
 *
 * const validUrl = "https://example.com";
 * const safeValid = sanitizeURL(validUrl);
 * // Returns: "https://example.com"
 * ```
 */
export const sanitizeURL = (url: string): string => {
  if (typeof url !== 'string') {
    return '';
  }

  try {
    const sanitized = DOMPurify.sanitize(url, STRICT_CONFIG).trim();

    if (!/^https?:\/\//i.test(sanitized)) {
      return '';
    }

    const urlObj = new URL(sanitized);
    if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
      return '';
    }

    return urlObj.href;
  } catch (error) {
    return '';
  }
};

/**
 * Sanitizes object properties recursively
 *
 * @description Deep sanitization of object properties. Useful for sanitizing
 * form data objects before submission or storage.
 *
 * @param {Record<string, unknown>} obj - The object to sanitize
 * @param {SanitizationOptions} options - Optional sanitization configuration
 * @returns {Record<string, unknown>} Object with all string properties sanitized
 *
 * @example
 * ```typescript
 * const formData = {
 *   name: "John<script>alert('xss')</script>",
 *   email: "john@example.com",
 *   nested: {
 *     field: "<img src=x onerror=alert('xss')>"
 *   }
 * };
 * const safe = sanitizeObject(formData);
 * // Returns: { name: "John", email: "john@example.com", nested: { field: "" } }
 * ```
 */
export const sanitizeObject = (
  obj: Record<string, unknown>,
  options: SanitizationOptions = {}
): Record<string, unknown> => {
  if (typeof obj !== 'object' || obj === null) {
    return {};
  }

  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeInput(value, options);
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map((item) =>
        typeof item === 'string' ? sanitizeInput(item, options) : item
      );
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value as Record<string, unknown>, options);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
};

/**
 * Validates and sanitizes array input
 *
 * @description Sanitizes all string elements in an array. Useful for sanitizing
 * multi-select form data or tag inputs.
 *
 * @param {string[]} arr - Array of strings to sanitize
 * @param {SanitizationOptions} options - Optional sanitization configuration
 * @returns {string[]} Array with all strings sanitized
 *
 * @example
 * ```typescript
 * const tags = ["tag1", "<script>alert('xss')</script>", "tag3"];
 * const safe = sanitizeArray(tags);
 * // Returns: ["tag1", "", "tag3"]
 * ```
 */
export const sanitizeArray = (
  arr: string[],
  options: SanitizationOptions = {}
): string[] => {
  if (!Array.isArray(arr)) {
    return [];
  }

  return arr
    .map((item) => (typeof item === 'string' ? sanitizeInput(item, options) : ''))
    .filter((item) => item.length > 0);
};
