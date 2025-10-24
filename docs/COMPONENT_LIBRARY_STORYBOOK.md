# Component Library - Storybook Documentation

## Overview

This document provides comprehensive documentation for the Primary Cell Assessment Application component library using Storybook. Storybook serves as a living component documentation system, allowing developers and designers to browse, test, and understand all UI components in isolation.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Running Storybook](#running-storybook)
3. [Component Library Structure](#component-library-structure)
4. [Adding New Stories](#adding-new-stories)
5. [Component Documentation](#component-documentation)
6. [Design System Reference](#design-system-reference)
7. [Accessibility Testing](#accessibility-testing)
8. [Best Practices](#best-practices)
9. [Deployment](#deployment)

---

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Project dependencies installed (`npm install`)

### Installation

Storybook is already installed and configured in this project. If you need to reinstall:

```bash
npm install --save-dev storybook@^8.6.14 \
  @storybook/react@^8.6.14 \
  @storybook/react-vite@^8.6.14 \
  @storybook/addon-essentials@^8.6.14 \
  @storybook/addon-interactions@^8.6.14 \
  @storybook/addon-links@^8.6.14 \
  @storybook/addon-a11y@^8.6.14 \
  @storybook/blocks@^8.6.14 \
  @storybook/test@^8.6.14
```

---

## Running Storybook

### Development Mode

Start Storybook in development mode with hot module reloading:

```bash
npm run storybook
```

This will:
- Start the Storybook dev server on `http://localhost:6006`
- Watch for changes in story files
- Automatically reload when components or stories are modified
- Enable all addons and interactive features

### Build for Production

Create a static build of Storybook for deployment:

```bash
npm run build-storybook
```

This generates a static site in `storybook-static/` that can be deployed to any static hosting service.

---

## Component Library Structure

### Common Components

Located in `/src/components/common/`:

#### Button (`Button.tsx`)
Premium button component with Framer Motion animations.

**Variants:**
- `primary` - Navy background, white text (default)
- `secondary` - Cream outline, navy text
- `danger` - Red background, white text

**Sizes:**
- `small` - 44px min height (mobile-friendly)
- `large` - 48px min height (default)

**Features:**
- Disabled state
- Full width option
- Hover/tap animations
- Full accessibility support

**Story file:** `Button.stories.tsx`

---

#### FormField (`FormField.tsx`)
Premium form input with floating label animation.

**Input Types:**
- `text` - Standard text input (default)
- `email` - Email with validation keyboard
- `tel` - Telephone number
- `password` - Obscured password input
- `number` - Numeric input
- `url` - URL input

**Features:**
- Floating label animation
- Error state with icon and message
- Helper text
- Required field indicator
- Disabled state
- Full accessibility with ARIA

**Story file:** `FormField.stories.tsx`

---

#### Checkbox (`Checkbox.tsx`)
Custom checkbox with spring animations.

**Features:**
- Animated checkmark with path drawing
- Spring animation on toggle
- Optional description text
- Disabled state
- 44x44px touch target
- Keyboard navigation (Space/Enter)
- Full accessibility

**Story file:** `Checkbox.stories.tsx`

---

#### Card (`Card.tsx`)
Flexible card component for containers and modals.

**Variants:**
- `white` - White background with border (default)
- `primary` - Navy background, white text
- `secondary` - Cream background

**Shadow Depths:**
- `none` - No shadow (flat)
- `sm` - Subtle shadow
- `md` - Medium shadow (default)
- `lg` - Large shadow
- `xl` - Extra large shadow

**Padding Sizes:**
- `none` - No padding
- `sm` - 16px
- `md` - 24px (default)
- `lg` - 32px

**Features:**
- Hover effects with elevation
- Interactive support with onClick
- Keyboard navigation
- Full width option

**Story file:** `Card.stories.tsx`

---

### Page Components

Located in `/src/pages/`:

#### LandingPage (`LandingPage.tsx`)
Entry point for the assessment flow.

**Features:**
- Hero section with compelling headline
- Educational content blocks (3 damage types)
- Visual section with AI image description
- Yes/No qualification question
- Framer Motion entrance animations
- Mobile-first responsive design
- WCAG 2.1 AA accessible

**Routing:**
- Yes (6+ months pain) → `/cellular-science`
- No (<6 months pain) → `/waiting-list`

**Story file:** `LandingPage.stories.tsx`

---

## Adding New Stories

### Story File Structure

Create a new `.stories.tsx` file next to your component:

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { YourComponent } from './YourComponent';

/**
 * Component description and documentation
 */
const meta = {
  title: 'Category/ComponentName',
  component: YourComponent,
  parameters: {
    layout: 'centered', // or 'fullscreen', 'padded'
    docs: {
      description: {
        component: 'Component description for docs page.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    propName: {
      control: 'text', // or 'boolean', 'select', etc.
      description: 'Description of this prop',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'default' },
      },
    },
  },
} satisfies Meta<typeof YourComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default story
 */
export const Default: Story = {
  args: {
    propName: 'value',
  },
};

/**
 * Another variant
 */
export const Variant: Story = {
  args: {
    propName: 'different value',
  },
};
```

### Using Decorators

For components that need context providers:

```tsx
import { BrowserRouter } from 'react-router-dom';
import { AssessmentProvider } from '@context/AssessmentContext';

const meta = {
  // ... other config
  decorators: [
    (Story) => (
      <BrowserRouter>
        <AssessmentProvider>
          <Story />
        </AssessmentProvider>
      </BrowserRouter>
    ),
  ],
};
```

### Interactive Stories

For stories with state management:

```tsx
import React from 'react';

export const Interactive: Story = {
  render: function InteractiveExample() {
    const [value, setValue] = React.useState('');

    return (
      <YourComponent
        value={value}
        onChange={setValue}
      />
    );
  },
};
```

---

## Component Documentation

### Prop Documentation

All component props are automatically documented using TypeScript interfaces. Storybook extracts:
- Prop names
- Types
- Descriptions from JSDoc comments
- Default values
- Required/optional status

**Example:**

```tsx
export interface ButtonProps {
  /**
   * Visual style variant of the button
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'danger';

  /**
   * Size variant of the button
   * @default 'large'
   */
  size?: 'small' | 'large';

  /**
   * Whether the button is disabled
   * @default false
   */
  disabled?: boolean;
}
```

### Controls Panel

The Controls panel allows interactive testing of component props:
- Text inputs for strings
- Checkboxes for booleans
- Select dropdowns for enums
- Number sliders for numbers

### Actions Logger

The Actions panel logs all event handlers:
- Click events
- Change events
- Form submissions
- Custom events

---

## Design System Reference

### Color Palette

**Primary Colors:**
- Navy: `#1A365D` (--color-primary-navy)
- Cream: `#F7F4ED` (--color-secondary-cream)

**Semantic Colors:**
- Success: `#38A169`
- Warning: `#ED8936`
- Error: `#E53E3E`
- Info: `#3182CE`

**Neutral Grays:**
- Gray 100-900 (see `global.css`)

### Typography

**Font Family:**
- Sans-serif: `Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto'`

**Font Sizes:**
- H1: 36px (2.25rem)
- H2: 30px (1.875rem)
- H3: 24px (1.5rem)
- H4: 20px (1.25rem)
- Body: 16px (1rem)

### Spacing Scale

Based on 8px grid:
- xs: 4px (0.25rem)
- sm: 8px (0.5rem)
- md: 16px (1rem)
- lg: 24px (1.5rem)
- xl: 32px (2rem)
- 2xl: 48px (3rem)
- 3xl: 64px (4rem)

### Border Radius

- sm: 4px
- base: 8px
- md: 12px
- lg: 16px
- xl: 24px
- full: 9999px

### Shadows

- sm: `0 1px 2px rgba(0, 0, 0, 0.05)`
- base: `0 1px 3px rgba(0, 0, 0, 0.1)`
- md: `0 4px 6px rgba(0, 0, 0, 0.1)`
- lg: `0 10px 15px rgba(0, 0, 0, 0.1)`
- xl: `0 20px 25px rgba(0, 0, 0, 0.1)`

---

## Accessibility Testing

### A11y Addon

The Accessibility addon (`@storybook/addon-a11y`) automatically tests stories for:
- Color contrast (WCAG AA/AAA)
- ARIA attributes
- Keyboard navigation
- Focus management
- Semantic HTML
- Alt text for images

**Using the A11y Panel:**
1. Select a story
2. Open the Accessibility panel at the bottom
3. Review violations, passes, and incomplete tests
4. Click violations for detailed remediation guidance

### Manual Testing

**Keyboard Navigation:**
- Tab through all interactive elements
- Verify focus indicators are visible
- Test Enter/Space on buttons and checkboxes
- Ensure disabled elements are not focusable

**Screen Reader Testing:**
- Test with VoiceOver (Mac), NVDA (Windows), or JAWS
- Verify all content is announced
- Check ARIA labels are meaningful
- Ensure state changes are announced

### Responsive Viewports

Test components at different breakpoints:
- Mobile: 375px × 667px
- Tablet: 768px × 1024px
- Desktop: 1280px × 800px
- Large Desktop: 1920px × 1080px

Use the viewport toolbar to switch between sizes.

---

## Best Practices

### Story Organization

**Naming Convention:**
- Use PascalCase for story exports
- Use descriptive names: `Primary`, `WithError`, `Disabled`
- Group related states: `AllVariants`, `AllSizes`

**Story Categories:**
1. Default/primary variant
2. All variants comparison
3. Different states (error, disabled, loading)
4. Interactive demos
5. Real-world examples
6. Accessibility tests

### Component Development Workflow

1. **Create Component** - Build component with TypeScript
2. **Write Stories** - Document all variants and states
3. **Test Accessibility** - Run A11y addon and manual tests
4. **Test Responsiveness** - Check all viewport sizes
5. **Review in Storybook** - Verify documentation is clear
6. **Integrate** - Use component in pages

### Documentation Standards

**Component Description:**
- Brief overview (1-2 sentences)
- Key features (bullet list)
- Usage examples
- Props documentation

**Story Description:**
- What this story demonstrates
- When to use this variant
- Any special notes or warnings

### Performance

**Optimize Large Stories:**
- Use `parameters.layout` to control canvas size
- Lazy load heavy components
- Avoid unnecessary re-renders in interactive stories
- Use React.memo for expensive components

---

## Deployment

### Deploy to GitHub Pages

1. **Build Storybook:**
   ```bash
   npm run build-storybook
   ```

2. **Configure GitHub Pages:**
   - Go to repository Settings > Pages
   - Source: Deploy from a branch
   - Branch: `main` or `gh-pages`
   - Folder: `/storybook-static` or `/root`

3. **Deploy:**
   ```bash
   # Option 1: Use gh-pages package
   npm install --save-dev gh-pages
   npx gh-pages -d storybook-static

   # Option 2: Manual commit to gh-pages branch
   git subtree push --prefix storybook-static origin gh-pages
   ```

4. **Access:**
   - Your Storybook will be available at:
   - `https://[username].github.io/[repository]/`

### Deploy to Netlify

1. **Build Storybook:**
   ```bash
   npm run build-storybook
   ```

2. **Deploy:**
   - Drag and drop `storybook-static/` folder to Netlify
   - Or connect GitHub repo with build command: `npm run build-storybook`
   - Publish directory: `storybook-static`

### Deploy to Vercel

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   npm run build-storybook
   vercel --prod storybook-static
   ```

### Deploy to Chromatic

Chromatic provides visual regression testing and hosting:

```bash
npm install --save-dev chromatic
npx chromatic --project-token=<your-token>
```

---

## Storybook Configuration

### Main Configuration (`.storybook/main.ts`)

**Key Settings:**
- Stories location: `../src/**/*.stories.@(js|jsx|ts|tsx)`
- Framework: React with Vite builder
- Addons: Essentials, Interactions, Links, A11y
- TypeScript: React Docgen enabled
- Path aliases: Matches project aliases (@components, @pages, etc.)

### Preview Configuration (`.storybook/preview.ts`)

**Global Parameters:**
- Backgrounds: White, Cream, Navy, Gray
- Viewports: Mobile, Tablet, Desktop presets
- Layout: Centered by default
- A11y: Color contrast and label checking enabled

**Global Decorators:**
- Font family wrapper for consistent typography

---

## Troubleshooting

### Common Issues

**Issue: "Module not found" errors**
- Verify path aliases in `.storybook/main.ts` match `tsconfig.json`
- Restart Storybook dev server after config changes

**Issue: Stories not appearing**
- Check file naming: `*.stories.tsx`
- Verify file location matches `stories` pattern in `main.ts`
- Check for TypeScript errors

**Issue: Context provider errors**
- Add required providers to story decorators
- Wrap with BrowserRouter for routing components

**Issue: Slow performance**
- Reduce number of stories in one file
- Use lazy loading for heavy components
- Disable addons you don't need

---

## Additional Resources

### Official Documentation
- [Storybook Docs](https://storybook.js.org/docs)
- [React Storybook](https://storybook.js.org/docs/react/get-started/introduction)
- [Writing Stories](https://storybook.js.org/docs/react/writing-stories/introduction)
- [Accessibility Addon](https://storybook.js.org/addons/@storybook/addon-a11y)

### Design System
- [Tailwind CSS](https://tailwindcss.com/) (similar color/spacing system)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Framer Motion](https://www.framer.com/motion/) (animation library)

### Testing
- [Storybook Test Runner](https://storybook.js.org/docs/react/writing-tests/test-runner)
- [Chromatic](https://www.chromatic.com/) (visual testing)
- [axe DevTools](https://www.deque.com/axe/devtools/) (accessibility testing)

---

## Contributing

When adding new components or stories:

1. Follow existing naming conventions
2. Document all props with TypeScript and JSDoc
3. Create comprehensive stories covering all states
4. Test accessibility with A11y addon
5. Test all viewport sizes
6. Update this documentation if needed

---

## Version History

- **v1.0.0** (2025-01-24)
  - Initial Storybook setup
  - Button, FormField, Checkbox, Card components
  - LandingPage page stories
  - Full accessibility testing
  - Responsive viewport configuration

---

## License

UNLICENSED - Primary Cell Assessment Application

---

## Support

For questions or issues with Storybook:
1. Check this documentation
2. Review official Storybook docs
3. Check component source code and stories
4. Contact the development team

---

**Last Updated:** January 24, 2025
**Storybook Version:** 8.6.14
**Maintained by:** Primary Cell Development Team
