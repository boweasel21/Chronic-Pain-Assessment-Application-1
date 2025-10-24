/**
 * Main Application Component
 * Configures routing and provides global context
 *
 * Security Features:
 * - CSRF protection initialized on app mount
 * - All API requests automatically protected with CSRF tokens
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AssessmentProvider } from '@context/AssessmentContext';
import AssessmentLayout from '@components/layout/AssessmentLayout';
import { useCsrfInit } from './hooks/useCsrf';

/**
 * Lazy-loaded page components for code splitting
 * Pages will be loaded on demand for better performance
 */

/* Assessment Pages (1-8) */
const LandingPage = React.lazy(() => import('./pages/LandingPage'));
const CellularSciencePage = React.lazy(() => import('./pages/CellularSciencePage'));
const ConditionConfirmationPage = React.lazy(() => import('./pages/ConditionConfirmationPage'));
const TreatmentHistory = React.lazy(() => import('./pages/TreatmentHistory'));
const UrgencyAssessment = React.lazy(() => import('./pages/UrgencyAssessment'));
const BudgetQualification = React.lazy(() => import('./pages/BudgetQualification'));
const AffordabilityCheck = React.lazy(() => import('./pages/AffordabilityCheck'));
const AdditionalInfo = React.lazy(() => import('./pages/AdditionalInfo'));
const ResultsPage = React.lazy(() => import('./pages/ResultsPage'));

/* Exit Pages */
const DisqualificationPage = React.lazy(() => import('./pages/DisqualificationPage'));
const WaitingListPage = React.lazy(() => import('./pages/WaitingListPage'));

/* Educational Flow Pages (9-10) */
const ProcessExplanation = React.lazy(() => import('./pages/ProcessExplanation'));
const DetailedProcess = React.lazy(() => import('./pages/DetailedProcess'));

/* Proof Offer Pages (11-12) */
const ProofOffer1 = React.lazy(() => import('./pages/ProofOffer1'));
const ProofOffer2 = React.lazy(() => import('./pages/ProofOffer2'));

/* Lead Capture & Final Pages (13-14) */
const LeadCapture = React.lazy(() => import('./pages/LeadCapture'));
const FinalVideoPage = React.lazy(() => import('./pages/FinalVideoPage'));

/**
 * Loading fallback component
 * Displayed while lazy-loaded components are being fetched
 */
const LoadingFallback: React.FC = () => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: 'var(--color-secondary-cream)',
    }}
  >
    <div
      style={{
        textAlign: 'center',
        color: 'var(--color-primary-navy)',
      }}
    >
      <div
        style={{
          width: '48px',
          height: '48px',
          border: '4px solid var(--color-gray-300)',
          borderTopColor: 'var(--color-primary-navy)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 16px',
        }}
      />
      <p style={{ fontSize: '1.125rem', fontWeight: 500 }}>Loading...</p>
    </div>
  </div>
);

/**
 * Route guard component for qualification-protected routes
 * Redirects to disqualified page if user is not qualified
 */
interface ProtectedRouteProps {
  children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // In a real implementation, this would check qualification status from context
  // For now, we'll render the children as the context will handle the logic
  return children;
};

/**
 * Main App Component
 * Sets up routing, context providers, and global suspense boundaries
 */
const App: React.FC = () => {
  // Initialize CSRF protection on app mount
  useCsrfInit();

  return (
    <BrowserRouter>
      <AssessmentProvider>
        <React.Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Page 1: Landing Page - Initial Qualification */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/waiting-list" element={<WaitingListPage />} />

            {/* Page 2: Cellular Science & Condition Selection */}
            <Route
              path="/cellular-science"
              element={
                <AssessmentLayout>
                  <CellularSciencePage />
                </AssessmentLayout>
              }
            />

            {/* Disqualification Page */}
            <Route path="/disqualified" element={<DisqualificationPage />} />

            {/* Page 3: Condition Confirmation */}
            <Route
              path="/condition-confirmation"
              element={
                <AssessmentLayout>
                  <ConditionConfirmationPage />
                </AssessmentLayout>
              }
            />

            {/* Page 4: Treatment History */}
            <Route
              path="/treatment-history"
              element={
                <AssessmentLayout>
                  <TreatmentHistory />
                </AssessmentLayout>
              }
            />

            {/* Page 5: Urgency Assessment */}
            <Route
              path="/urgency-assessment"
              element={
                <AssessmentLayout>
                  <UrgencyAssessment />
                </AssessmentLayout>
              }
            />

            {/* Page 6: Budget Qualification */}
            <Route
              path="/budget-qualification"
              element={
                <AssessmentLayout>
                  <BudgetQualification />
                </AssessmentLayout>
              }
            />

            {/* Page 6B: Affordability Check (conditional from Page 6) */}
            <Route
              path="/affordability"
              element={
                <AssessmentLayout>
                  <AffordabilityCheck />
                </AssessmentLayout>
              }
            />

            {/* Page 7: Additional Information */}
            <Route
              path="/additional-info"
              element={
                <AssessmentLayout>
                  <AdditionalInfo />
                </AssessmentLayout>
              }
            />

            {/* Page 8: Personalized Results Page */}
            <Route
              path="/results"
              element={
                <AssessmentLayout>
                  <ResultsPage />
                </AssessmentLayout>
              }
            />

            {/* Page 9: Process Explanation */}
            <Route
              path="/process-explanation"
              element={
                <AssessmentLayout>
                  <ProcessExplanation />
                </AssessmentLayout>
              }
            />

            {/* Page 10: Detailed 4-Step Process */}
            <Route
              path="/detailed-process"
              element={
                <AssessmentLayout>
                  <DetailedProcess />
                </AssessmentLayout>
              }
            />

            {/* Page 11: Proof Offer 1 - Highlights Video */}
            <Route
              path="/proof-offer-1"
              element={
                <AssessmentLayout>
                  <ProofOffer1 />
                </AssessmentLayout>
              }
            />

            {/* Page 12: Proof Offer 2 - Demo Video */}
            <Route
              path="/proof-offer-2"
              element={
                <AssessmentLayout>
                  <ProofOffer2 />
                </AssessmentLayout>
              }
            />

            {/* Page 13: Lead Capture Form */}
            <Route
              path="/lead-capture"
              element={
                <AssessmentLayout>
                  <LeadCapture />
                </AssessmentLayout>
              }
            />

            {/* Page 14: Final Video & Confirmation */}
            <Route
              path="/final-video"
              element={
                <AssessmentLayout>
                  <FinalVideoPage />
                </AssessmentLayout>
              }
            />

            {/* Catch-all redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </React.Suspense>
      </AssessmentProvider>

      {/* Global styles for spinner animation */}
      <style>
        {`
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </BrowserRouter>
  );
};

export default App;
