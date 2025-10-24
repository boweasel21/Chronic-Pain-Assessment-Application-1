# Component Library - Visual Guide

## Quick Visual Reference

This guide provides ASCII mockups of how each component appears visually.

---

## 1. Button Component

### Primary Button (Large)
```
┌─────────────────────────────────┐
│                                 │
│          Next Step              │  ← Navy background (#1D2C49)
│                                 │     White text, 48px height
└─────────────────────────────────┘
  ↑ Hover: Scale 1.02, shadow
  ↓ Click: Scale 0.98
```

### Secondary Button (Large)
```
╔═════════════════════════════════╗
║                                 ║
║          Go Back                ║  ← Cream border (#E2D3A3)
║                                 ║     Navy text, transparent bg
╚═════════════════════════════════╝
  ↑ Hover: Cream background fill
```

### Danger Button (Large)
```
┌─────────────────────────────────┐
│                                 │
│          Delete                 │  ← Red background (#EF4444)
│                                 │     White text, 48px height
└─────────────────────────────────┘
  ⚠️ Use sparingly for destructive actions
```

### Button Sizes Comparison
```
Small:  ┌───────────┐  44px min height
        │   Small   │
        └───────────┘

Large:  ┌───────────────┐  48px min height
        │     Large     │
        └───────────────┘
```

---

## 2. Checkbox Component

### Unchecked State
```
┌──────┐
│      │  ← Cream border, white background
└──────┘    24x24px visual, 44x44px touch target

□ Checkbox Label
  Description text in smaller, muted color
```

### Checked State (Animated)
```
┌──────┐
│  ✓   │  ← Navy background with white checkmark
└──────┘    Spring animation: scale 0→1, rotate -180→0
            Stroke path animates

☑ Checkbox Label
  Description text in smaller, muted color
```

### Animation Sequence
```
Frame 1:  □  (unchecked, cream border)
Frame 2:  ▢  (border turning navy)
Frame 3:  ⊡  (background filling navy)
Frame 4:  ☑  (checkmark animating in with rotation)
```

---

## 3. FormField Component

### Empty State
```
┌─────────────────────────────────────────┐
│                                         │
│  Label                                  │  ← Label centered vertically
│                                         │
└─────────────────────────────────────────┘
  Cream border (2px), 56px height
```

### Focused State
```
┌─────────────────────────────────────────┐
│ Label  ← Moved up, scaled 85%           │
│                                         │
│  your@email.com                         │  ← Placeholder visible
└─────────────────────────────────────────┘
  ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
  Navy border + 2px navy underline animating
```

### Filled State
```
┌─────────────────────────────────────────┐
│ Email Address *  ← Stays up when filled │
│                                         │
│  john@example.com                       │
└─────────────────────────────────────────┘
  Navy border, label remains floating
```

### Error State
```
┌─────────────────────────────────────────┐
│ Email Address *                         │
│                                         │
│  invalid-email                          │  ← Light red background
└─────────────────────────────────────────┘
  ⚠️ Please enter a valid email address  ← Error icon + message
  Red border (#EF4444)
```

### With Helper Text
```
┌─────────────────────────────────────────┐
│ Phone Number                            │
│                                         │
│  (555) 123-4567                         │
└─────────────────────────────────────────┘
  💡 Include your area code  ← Muted helper text
```

---

## 4. ProgressBar Component

### With Label and Percentage
```
Step 3 of 10                              30%

█████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
 ← Navy fill (30%)    Light cream track →

Inner highlight for 3D depth effect
Animates width smoothly (300ms ease-out)
```

### Label Only
```
Step 5 of 14

████████████████████████░░░░░░░░░░░░░░░░░░
```

### Percentage Only
```
                                          75%

██████████████████████████████████░░░░░░░░
```

---

## 5. PageTransition Component

### Animation Flow
```
Exit Previous Page:
┌─────────────────┐
│   Page Content  │  → Fade out (opacity 1→0)
│                 │     Slide up (y: 0→-20px)
└─────────────────┘     Duration: 200ms

     ↓

Enter New Page:
┌─────────────────┐
│                 │  ← Fade in (opacity 0→1)
│   New Content   │     Slide up (y: 20→0px)
└─────────────────┘     Duration: 300ms
```

### Reduced Motion Mode
```
Exit:  [████████] → [░░░░░░░░]  Instant fade only
Enter: [░░░░░░░░] → [████████]  10ms transition
```

---

## 6. Card Component

### White Variant (Default)
```
┌─────────────────────────────────────────┐
│                                         │
│  Card Title                             │
│                                         │
│  Card content goes here with proper    │
│  padding and spacing. White background │
│  with subtle border and shadow.         │
│                                         │
└─────────────────────────────────────────┘
  White bg, light border, medium shadow
```

### Primary Variant
```
╔═════════════════════════════════════════╗
║ █████████████████████████████████████ ║
║ █                                   █ ║
║ █  Highlighted Card                 █ ║
║ █                                   █ ║
║ █  Navy background with white text  █ ║
║ █                                   █ ║
║ █████████████████████████████████████ ║
╚═════════════════════════════════════════╝
  Navy bg (#1D2C49), white text, large shadow
```

### Secondary Variant
```
┌─────────────────────────────────────────┐
│ ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ │
│ ▒                                   ▒ │
│ ▒  Subtle Emphasis                  ▒ │
│ ▒                                   ▒ │
│ ▒  Cream background with navy text  ▒ │
│ ▒                                   ▒ │
│ ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ │
└─────────────────────────────────────────┘
  Cream bg (rgba(226,211,163,0.2)), navy text
```

### Hoverable Card
```
Rest State:
┌─────────────────┐
│                 │
│   Card Content  │
└─────────────────┘

Hover State:
    ↑ -4px lift
┌─────────────────┐
│                 │  ← Shadow increases
│   Card Content  │     Smooth transition (150ms)
└─────────────────┘
```

### Interactive Card
```
┌─────────────────────────────────┐
│                                 │
│   Clickable Card                │
│                                 │  ← Cursor: pointer
│   Tab to focus, Enter to click  │     Keyboard accessible
│                                 │
└─────────────────────────────────┘
  ↑ Focus: Cream outline (3px, 2px offset)
```

---

## Layout Examples

### Multi-Step Form Layout
```
┌────────────────────────────────────────────────────────┐
│  Step 2 of 5                                       40% │
│  ████████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
└────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────┐
│                                                        │
│  Question Title                                        │
│                                                        │
│  ┌──────┐                                             │
│  │  ✓   │  Option 1                                   │
│  └──────┘  Description text for option 1              │
│                                                        │
│  ┌──────┐                                             │
│  │      │  Option 2                                   │
│  └──────┘  Description text for option 2              │
│                                                        │
│  ┌──────┐                                             │
│  │  ✓   │  Option 3                                   │
│  └──────┘  Description text for option 3              │
│                                                        │
└────────────────────────────────────────────────────────┘

┌─────────────────┐                    ┌───────────────┐
│      Back       │                    │     Next      │
└─────────────────┘                    └───────────────┘
  Secondary button                       Primary button
```

### Contact Form Layout
```
┌────────────────────────────────────────────────────────┐
│                                                        │
│  Contact Information                                   │
│                                                        │
│  ┌──────────────────────────────────────────────────┐ │
│  │ Full Name *                                      │ │
│  │                                                  │ │
│  │  John Doe                                        │ │
│  └──────────────────────────────────────────────────┘ │
│                                                        │
│  ┌──────────────────────────────────────────────────┐ │
│  │ Email Address *                                  │ │
│  │                                                  │ │
│  │  john@example.com                                │ │
│  └──────────────────────────────────────────────────┘ │
│    We'll never share your email with anyone           │
│                                                        │
│  ┌──────────────────────────────────────────────────┐ │
│  │ Phone Number                                     │ │
│  │                                                  │ │
│  │  (555) 123-4567                                  │ │
│  └──────────────────────────────────────────────────┘ │
│    Include your area code                             │
│                                                        │
│  ┌──────┐                                             │
│  │  ✓   │  I agree to the terms and conditions       │
│  └──────┘  You must agree to continue                 │
│                                                        │
│                           ┌───────────────────────┐   │
│                           │   Submit Form         │   │
│                           └───────────────────────┘   │
│                                                        │
└────────────────────────────────────────────────────────┘
```

### Card Grid Layout
```
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│                  │  │                  │  │                  │
│   Card Title 1   │  │   Card Title 2   │  │   Card Title 3   │
│                  │  │                  │  │                  │
│   Description    │  │   Description    │  │   Description    │
│   text here      │  │   text here      │  │   text here      │
│                  │  │                  │  │                  │
└──────────────────┘  └──────────────────┘  └──────────────────┘
  Hoverable cards with responsive grid (auto-fit minmax)
```

### Nested Cards
```
┌────────────────────────────────────────────────────────┐
│ ████████████████████████████████████████████████████ │
│ █                                                  █ │
│ █  Primary Card Title                             █ │
│ █                                                  █ │
│ █  ┌──────────────────────────────────────────┐  █ │
│ █  │                                          │  █ │
│ █  │  Nested White Card                       │  █ │
│ █  │                                          │  █ │
│ █  │  Content inside nested card              │  █ │
│ █  │                                          │  █ │
│ █  └──────────────────────────────────────────┘  █ │
│ █                                                  █ │
│ ████████████████████████████████████████████████████ │
└────────────────────────────────────────────────────────┘
```

---

## Responsive Behavior

### Desktop (1024px+)
```
┌────────────────────────────────────────────────────────────┐
│  [Progress Bar - Full Width]                              │
│                                                            │
│  ┌────────────────────────────────────────────────────┐   │
│  │                                                    │   │
│  │  Large Card (800px max-width, centered)           │   │
│  │                                                    │   │
│  │  [Form Fields - Full Width]                       │   │
│  │                                                    │   │
│  │  [Buttons - Right Aligned]                        │   │
│  │                                                    │   │
│  └────────────────────────────────────────────────────┘   │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### Tablet (768px)
```
┌──────────────────────────────────────┐
│  [Progress Bar]                      │
│                                      │
│  ┌──────────────────────────────┐   │
│  │                              │   │
│  │  Card (full width, padding)  │   │
│  │                              │   │
│  │  [Form Fields - Stacked]     │   │
│  │                              │   │
│  │  [Buttons - Full Width]      │   │
│  │                              │   │
│  └──────────────────────────────┘   │
│                                      │
└──────────────────────────────────────┘
```

### Mobile (320px - 640px)
```
┌────────────────────┐
│  [Progress Bar]    │
│                    │
│  ┌──────────────┐  │
│  │              │  │
│  │  Card        │  │
│  │  (full w)    │  │
│  │              │  │
│  │  [Fields]    │  │
│  │  [Stacked]   │  │
│  │              │  │
│  │  [Buttons]   │  │
│  │  [Full W]    │  │
│  │              │  │
│  └──────────────┘  │
│                    │
└────────────────────┘
 Touch targets: 48px
```

---

## Color Reference

### Visual Color Swatches

```
Primary Navy:
███████████  #1D2C49 / rgba(29, 44, 73, 1)
Use: Buttons, headers, filled states

Secondary Cream:
▓▓▓▓▓▓▓▓▓▓▓  #E2D3A3 / rgba(226, 211, 163, 1)
Use: Borders, accents, focus outlines

White:
░░░░░░░░░░░  #FFFFFF
Use: Card backgrounds, button text

Off-White:
░░░░░░░░░░░  #FAFAFA
Use: Page backgrounds

Gray (Muted Text):
▒▒▒▒▒▒▒▒▒▒▒  #737373
Use: Helper text, descriptions

Red (Danger):
███████████  #EF4444
Use: Errors, destructive actions

Success Green:
███████████  #10B981
Use: Success messages

Warning Orange:
███████████  #F59E0B
Use: Warnings, caution states
```

---

## Touch Targets & Spacing

### Minimum Touch Targets
```
Desktop:
┌──────────────────┐
│                  │  44px × 44px minimum
│    Clickable     │
│                  │
└──────────────────┘

Mobile:
┌──────────────────┐
│                  │
│                  │  48px × 48px minimum
│    Clickable     │
│                  │
└──────────────────┘
```

### 8px Grid System
```
8px:   ┆
16px:  ┆       ┆
24px:  ┆       ┆       ┆
32px:  ┆       ┆       ┆       ┆
48px:  ┆       ┆       ┆       ┆       ┆       ┆
64px:  ┆       ┆       ┆       ┆       ┆       ┆       ┆       ┆

All spacing must align to this grid!
```

---

## Focus States

### Focus Indicator (All Components)
```
Rest State:
┌─────────────┐
│   Button    │
└─────────────┘

Focus State (Keyboard):
    3px cream outline
   ╱                 ╲
  ┏━━━━━━━━━━━━━━━┓
  ┃ ┌─────────────┐ ┃  ← 2px offset
  ┃ │   Button    │ ┃
  ┃ └─────────────┘ ┃
  ┗━━━━━━━━━━━━━━━┛
```

---

## Animation Timing Reference

```
Instant:  ▓                     (100ms)
Fast:     ▓▓                    (150ms) ← Buttons, hover
Normal:   ▓▓▓                   (300ms) ← Pages, width
Slow:     ▓▓▓▓▓                 (500ms) ← Complex

Easing:
linear:    ▂▄▆█  (constant speed)
ease-out:  ██▅▂  (fast start, slow end) ← Most common
ease-in:   ▂▅██  (slow start, fast end)
spring:    ███▁▃▂ (bouncy, natural)    ← Checkbox
```

---

## Accessibility Indicators

### Screen Reader Announcements
```
Button:       "Submit form, button"
Checkbox:     "I agree to terms, checkbox, not checked"
FormField:    "Email address, edit text, invalid entry"
ProgressBar:  "Step 3 of 10, 30% complete"
```

### Keyboard Navigation Flow
```
1. Tab → Focus first interactive element
2. Tab → Focus next element (visual order)
3. Enter/Space → Activate focused element
4. Shift+Tab → Focus previous element

Example flow:
[Input Field] → [Checkbox] → [Submit Button] → [Link]
     ↑                                            ↓
     └────────────────────────────────────────────┘
              Shift+Tab returns
```

---

## Print Styles

### How Components Appear When Printed
```
┌─────────────────────────────────┐
│ All components maintain layout  │  ← Black text
│ Colors simplified for printing  │     No shadows
│ Borders shown clearly           │     High contrast
│ Shadows removed                 │
└─────────────────────────────────┘

Buttons:  [Submit Form]  ← Outlined, no fill
Cards:    Border only, white background
Progress: ████░░░░  ← Clear bar with percentage
```

---

## Component States Summary

### Button
- ✅ Default (idle)
- ✅ Hover (scale 1.02)
- ✅ Active/Pressed (scale 0.98)
- ✅ Focus (cream outline)
- ✅ Disabled (50% opacity)

### Checkbox
- ✅ Unchecked (cream border)
- ✅ Checked (navy fill + checkmark)
- ✅ Hover (border darkens)
- ✅ Focus (cream outline)
- ✅ Disabled (50% opacity)

### FormField
- ✅ Empty (label centered)
- ✅ Focused (label floats, underline animates)
- ✅ Filled (label stays floated)
- ✅ Error (red border + message)
- ✅ Disabled (gray background)

### ProgressBar
- ✅ 0-100% (animated width)
- ✅ With label
- ✅ With percentage
- ✅ Both label + percentage

### Card
- ✅ Default (static)
- ✅ Hoverable (lifts + shadow)
- ✅ Interactive (clickable)
- ✅ Focus (cream outline)
- ✅ Disabled (50% opacity)

---

## Usage Patterns Cheat Sheet

### Form Pattern
```typescript
<FormField label="Name" value={name} onChange={setName} required />
<FormField label="Email" value={email} onChange={setEmail} error={error} />
<Checkbox id="terms" label="Agree" checked={agreed} onChange={setAgreed} />
<Button variant="primary" onClick={submit} aria-label="Submit">Submit</Button>
```

### Multi-Step Pattern
```typescript
<ProgressBar current={step} total={10} showLabel showPercentage />
<PageTransition transitionKey={step}>
  {step === 1 && <Step1 />}
  {step === 2 && <Step2 />}
</PageTransition>
<Button variant="secondary" onClick={prev}>Back</Button>
<Button variant="primary" onClick={next}>Next</Button>
```

### Card Grid Pattern
```typescript
<div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
  <Card variant="white" shadow="md" hoverable onClick={handler1}>...</Card>
  <Card variant="white" shadow="md" hoverable onClick={handler2}>...</Card>
  <Card variant="white" shadow="md" hoverable onClick={handler3}>...</Card>
</div>
```

---

## Quick Reference Card

```
┌─────────────────────────────────────────────────────────┐
│ COMPONENT LIBRARY QUICK REFERENCE                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Colors:                                                 │
│   Primary: #1D2C49 (Navy)                              │
│   Secondary: #E2D3A3 (Cream)                           │
│   Danger: #EF4444 (Red)                                │
│                                                         │
│ Spacing:                                                │
│   8px grid (xs: 8, sm: 16, md: 24, lg: 32, xl: 48)    │
│                                                         │
│ Touch Targets:                                          │
│   Desktop: 44×44px minimum                             │
│   Mobile: 48×48px minimum                              │
│                                                         │
│ Animations:                                             │
│   Fast: 150ms (buttons)                                │
│   Normal: 300ms (pages, forms)                         │
│   Easing: ease-out (most), spring (checkbox)          │
│                                                         │
│ Focus:                                                  │
│   3px cream outline, 2px offset                        │
│                                                         │
│ Imports:                                                │
│   import { Button, Card } from '@/components/common';  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

**All visual representations are approximations.**
**Refer to live components in browser for exact appearance.**

---

*Visual Guide v1.0 - October 24, 2025*
