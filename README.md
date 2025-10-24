# Primary Cell Assessment Application

A production-ready React 18 application for comprehensive chronic pain assessment and personalization, built with Vite, TypeScript, and modern frontend best practices.

## Features

- **17-Page Assessment Flow**: Qualification and personalization questions
- **Type-Safe State Management**: Context API with TypeScript strict mode
- **Accessible Design**: WCAG 2.1 AA compliant
- **Responsive Layout**: Mobile-first design
- **Production-Ready**: Optimized build with code splitting

## Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite 5
- **Language**: TypeScript 5 (Strict Mode)
- **Routing**: React Router v6
- **State Management**: Context API + useReducer
- **Styling**: CSS Variables + Inline Styles

## Project Structure

```
src/
├── components/
│   └── layout/
│       ├── AssessmentLayout.tsx
│       └── ProgressBar.tsx
├── context/
│   ├── AssessmentContext.tsx
│   └── AssessmentReducer.ts
├── pages/
│   └── [17 assessment pages]
├── styles/
│   ├── global.css
│   └── theme.ts
├── types/
│   └── index.ts
├── App.tsx
└── main.tsx
```

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type check
npm run type-check

# Lint code
npm run lint
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

```env
VITE_APP_TITLE=Primary Cell Assessment
VITE_API_BASE_URL=https://api.primarycell.com
VITE_ENVIRONMENT=development
```

## Development

### Code Quality

- **TypeScript Strict Mode**: All types enforced
- **ESLint**: Code quality and consistency
- **No Console Logs**: Production-ready code
- **JSDoc Comments**: Comprehensive documentation

### Accessibility

- WCAG 2.1 AA compliant
- Keyboard navigation support
- Screen reader optimized
- Focus management
- ARIA labels and live regions

### Performance

- Code splitting with React.lazy
- Optimized bundle size
- CSS-in-JS with variables
- Production build optimization

## Deployment

This application is ready for deployment on Emergent.sh or any static hosting platform.

### Build

```bash
npm run build
```

The `dist/` directory contains the production build.

### Deployment Platforms

- **Emergent.sh**: Automatic deployment from repository
- **Vercel**: Zero-configuration deployment
- **Netlify**: Drag-and-drop or CLI deployment
- **AWS S3 + CloudFront**: Static hosting

## Routes

| Route | Page | Status |
|-------|------|--------|
| `/` | Welcome | Public |
| `/diagnosis` | Clinical Diagnosis | Public |
| `/duration` | Pain Duration | Public |
| `/age` | Age Range | Public |
| `/disqualified` | Disqualified | Public |
| `/condition` | Condition Type | Protected |
| `/location` | Primary Location | Protected |
| `/sensations` | Pain Sensations | Protected |
| `/pain-level` | Pain Level | Protected |
| `/triggers` | Symptom Triggers | Protected |
| `/impact` | Daily Impact | Protected |
| `/treatments` | Current Treatments | Protected |
| `/effectiveness` | Treatment Effectiveness | Protected |
| `/lifestyle` | Lifestyle Modifications | Protected |
| `/wellness` | Wellness Metrics | Protected |
| `/support` | Support Systems | Protected |
| `/education` | Educational Interests | Protected |
| `/results` | Personalized Results | Protected |

## License

UNLICENSED - Proprietary software for Primary Cell

## Support

For questions or support, contact: support@primarycell.com
