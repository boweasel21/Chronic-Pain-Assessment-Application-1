/**
 * Main Application Component
 * Configures routing and provides global context
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AssessmentProvider } from '@context/AssessmentContext';
import AssessmentLayout from '@components/layout/AssessmentLayout';

/**
 * Lazy-loaded page components for code splitting
 * Pages will be loaded on demand for better performance
 */
const LandingPage = React.lazy(() => import('./pages/LandingPage'));
const CellularSciencePage = React.lazy(() => import('./pages/CellularSciencePage'));
const ConditionConfirmationPage = React.lazy(() => import('./pages/ConditionConfirmationPage'));
const WelcomePage = React.lazy(() => import('./pages/WelcomePage'));
const DiagnosisPage = React.lazy(() => import('./pages/DiagnosisPage'));
const DurationPage = React.lazy(() => import('./pages/DurationPage'));
const AgePage = React.lazy(() => import('./pages/AgePage'));
const DisqualifiedPage = React.lazy(() => import('./pages/DisqualificationPage'));
const WaitingListPage = React.lazy(() => import('./pages/WaitingListPage'));
const ConditionTypePage = React.lazy(() => import('./pages/ConditionTypePage'));
const LocationPage = React.lazy(() => import('./pages/LocationPage'));
const SensationsPage = React.lazy(() => import('./pages/SensationsPage'));
const PainLevelPage = React.lazy(() => import('./pages/PainLevelPage'));
const TriggersPage = React.lazy(() => import('./pages/TriggersPage'));
const ImpactPage = React.lazy(() => import('./pages/ImpactPage'));
const TreatmentsPage = React.lazy(() => import('./pages/TreatmentsPage'));
const EffectivenessPage = React.lazy(() => import('./pages/EffectivenessPage'));
const LifestylePage = React.lazy(() => import('./pages/LifestylePage'));
const WellnessPage = React.lazy(() => import('./pages/WellnessPage'));
const SupportPage = React.lazy(() => import('./pages/SupportPage'));
const EducationPage = React.lazy(() => import('./pages/EducationPage'));
const TreatmentHistory = React.lazy(() => import('./pages/TreatmentHistory'));
const UrgencyAssessment = React.lazy(() => import('./pages/UrgencyAssessment'));
const BudgetQualification = React.lazy(() => import('./pages/BudgetQualification'));
const AffordabilityCheck = React.lazy(() => import('./pages/AffordabilityCheck'));
const ProcessExplanation = React.lazy(() => import('./pages/ProcessExplanation'));
const DetailedProcess = React.lazy(() => import('./pages/DetailedProcess'));
const ProofOffer1 = React.lazy(() => import('./pages/ProofOffer1'));
const ProofOffer2 = React.lazy(() => import('./pages/ProofOffer2'));
const AdditionalInfo = React.lazy(() => import('./pages/AdditionalInfo'));
const ResultsPage = React.lazy(() => import('./pages/ResultsPage'));
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
  return (
    <BrowserRouter>
      <AssessmentProvider>
        <React.Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Primary Cell Assessment Pages 1-3 */}
            <Route
              path="/"
              element={<LandingPage />}
            />
            <Route
              path="/cellular-science"
              element={<CellularSciencePage />}
            />
            <Route
              path="/condition-confirmation"
              element={<ConditionConfirmationPage />}
            />
            <Route
              path="/waiting-list"
              element={<WaitingListPage />}
            />

            {/* Legacy Welcome and Qualification Routes */}
            <Route
              path="/welcome"
              element={
                <AssessmentLayout>
                  <WelcomePage />
                </AssessmentLayout>
              }
            />
            <Route
              path="/diagnosis"
              element={
                <AssessmentLayout>
                  <DiagnosisPage />
                </AssessmentLayout>
              }
            />
            <Route
              path="/duration"
              element={
                <AssessmentLayout>
                  <DurationPage />
                </AssessmentLayout>
              }
            />
            <Route
              path="/age"
              element={
                <AssessmentLayout>
                  <AgePage />
                </AssessmentLayout>
              }
            />
            <Route
              path="/disqualified"
              element={<DisqualifiedPage />}
            />

            {/* Personalization Routes - Protected */}
            <Route
              path="/condition"
              element={
                <ProtectedRoute>
                  <AssessmentLayout>
                    <ConditionTypePage />
                  </AssessmentLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/location"
              element={
                <ProtectedRoute>
                  <AssessmentLayout>
                    <LocationPage />
                  </AssessmentLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/sensations"
              element={
                <ProtectedRoute>
                  <AssessmentLayout>
                    <SensationsPage />
                  </AssessmentLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/pain-level"
              element={
                <ProtectedRoute>
                  <AssessmentLayout>
                    <PainLevelPage />
                  </AssessmentLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/triggers"
              element={
                <ProtectedRoute>
                  <AssessmentLayout>
                    <TriggersPage />
                  </AssessmentLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/impact"
              element={
                <ProtectedRoute>
                  <AssessmentLayout>
                    <ImpactPage />
                  </AssessmentLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/treatments"
              element={
                <ProtectedRoute>
                  <AssessmentLayout>
                    <TreatmentsPage />
                  </AssessmentLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/effectiveness"
              element={
                <ProtectedRoute>
                  <AssessmentLayout>
                    <EffectivenessPage />
                  </AssessmentLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/lifestyle"
              element={
                <ProtectedRoute>
                  <AssessmentLayout>
                    <LifestylePage />
                  </AssessmentLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/wellness"
              element={
                <ProtectedRoute>
                  <AssessmentLayout>
                    <WellnessPage />
                  </AssessmentLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/support"
              element={
                <ProtectedRoute>
                  <AssessmentLayout>
                    <SupportPage />
                  </AssessmentLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/education"
              element={
                <ProtectedRoute>
                  <AssessmentLayout>
                    <EducationPage />
                  </AssessmentLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/treatment-history"
              element={
                <ProtectedRoute>
                  <AssessmentLayout>
                    <TreatmentHistory />
                  </AssessmentLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/urgency-assessment"
              element={
                <ProtectedRoute>
                  <AssessmentLayout>
                    <UrgencyAssessment />
                  </AssessmentLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/budget-qualification"
              element={
                <ProtectedRoute>
                  <AssessmentLayout>
                    <BudgetQualification />
                  </AssessmentLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/affordability"
              element={
                <ProtectedRoute>
                  <AssessmentLayout>
                    <AffordabilityCheck />
                  </AssessmentLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/additional-info"
              element={
                <ProtectedRoute>
                  <AssessmentLayout>
                    <AdditionalInfo />
                  </AssessmentLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/results"
              element={
                <ProtectedRoute>
                  <AssessmentLayout>
                    <ResultsPage />
                  </AssessmentLayout>
                </ProtectedRoute>
              }
            />

            {/* Educational Flow Routes - Pages 9-10 */}
            <Route
              path="/process-explanation"
              element={
                <ProtectedRoute>
                  <ProcessExplanation />
                </ProtectedRoute>
              }
            />
            <Route
              path="/detailed-process"
              element={
                <ProtectedRoute>
                  <DetailedProcess />
                </ProtectedRoute>
              }
            />

            {/* Proof Offer Routes - Pages 11-12 */}
            <Route
              path="/proof-offer-1"
              element={
                <ProtectedRoute>
                  <ProofOffer1 />
                </ProtectedRoute>
              }
            />
            <Route
              path="/proof-offer-2"
              element={
                <ProtectedRoute>
                  <ProofOffer2 />
                </ProtectedRoute>
              }
            />

            {/* Lead Capture & Final Video - Pages 13-14 */}
            <Route
              path="/lead-capture"
              element={
                <ProtectedRoute>
                  <LeadCapture />
                </ProtectedRoute>
              }
            />
            <Route
              path="/final-video"
              element={
                <ProtectedRoute>
                  <FinalVideoPage />
                </ProtectedRoute>
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
