/**
 * Component Library Example Usage
 *
 * @description Demonstrates how to use all common components together
 * in a realistic application scenario. This file serves as both
 * documentation and a testing ground for components.
 *
 * @module ComponentExample
 */

import { useState } from 'react';
import { Button } from './Button';
import { Checkbox } from './Checkbox';
import { FormField } from './FormField';
import { ProgressBar } from './ProgressBar';
import { PageTransition } from './PageTransition';
import { Card } from './Card';

/**
 * ComponentExample Component
 *
 * @description Example implementation showing all components working together
 * @returns {JSX.Element} Example page with all components
 */
export const ComponentExample = (): JSX.Element => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 3;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [agreedToTerms, setAgreedToTerms] = useState<boolean>(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  /**
   * Validate form fields
   */
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!agreedToTerms) {
      newErrors.terms = 'You must agree to the terms';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle next button click
   */
  const handleNext = (): void => {
    if (currentStep === 1 && !validate()) {
      return;
    }

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  /**
   * Handle previous button click
   */
  const handlePrevious = (): void => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors({});
    }
  };

  /**
   * Handle checkbox change for multiple options
   */
  const handleOptionChange = (optionId: string, checked: boolean): void => {
    setSelectedOptions(prev =>
      checked
        ? [...prev, optionId]
        : prev.filter(id => id !== optionId)
    );
  };

  /**
   * Handle form submission
   */
  const handleSubmit = (): void => {
    alert('Form submitted successfully!');
  };

  /**
   * Example options for checkboxes
   */
  const options = [
    {
      id: 'option-1',
      label: 'Chronic back pain',
      description: 'Pain in the lower or upper back region'
    },
    {
      id: 'option-2',
      label: 'Joint pain',
      description: 'Pain in knees, hips, or other joints'
    },
    {
      id: 'option-3',
      label: 'Nerve pain',
      description: 'Sharp, burning, or tingling sensations'
    }
  ];

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px' }}>
      {/* Progress Bar */}
      <ProgressBar
        current={currentStep}
        total={totalSteps}
        showLabel
        showPercentage
        aria-label="Form completion progress"
      />

      {/* Page Transition Wrapper */}
      <PageTransition transitionKey={currentStep}>
        {/* Step 1: Form Fields */}
        {currentStep === 1 && (
          <Card variant="white" shadow="md" padding="lg">
            <h1 style={{ marginTop: 0 }}>Personal Information</h1>
            <p style={{ color: '#737373' }}>
              Please provide your contact information to continue.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <FormField
                label="Full Name"
                type="text"
                value={formData.name}
                onChange={(value) => setFormData({ ...formData, name: value })}
                error={errors.name}
                placeholder="John Doe"
                required
                aria-label="Enter your full name"
              />

              <FormField
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(value) => setFormData({ ...formData, email: value })}
                error={errors.email}
                placeholder="your@email.com"
                required
                helperText="We'll never share your email with anyone"
                aria-label="Enter your email address"
              />

              <FormField
                label="Phone Number"
                type="tel"
                value={formData.phone}
                onChange={(value) => setFormData({ ...formData, phone: value })}
                error={errors.phone}
                placeholder="(555) 123-4567"
                required
                helperText="Include your area code"
                aria-label="Enter your phone number"
              />

              <Checkbox
                id="terms-checkbox"
                label="I agree to the terms and conditions"
                description="You must agree to continue with the assessment"
                checked={agreedToTerms}
                onChange={setAgreedToTerms}
              />

              {errors.terms && (
                <p style={{ color: '#EF4444', fontSize: '0.875rem', margin: 0 }}>
                  {errors.terms}
                </p>
              )}
            </div>
          </Card>
        )}

        {/* Step 2: Multiple Choice */}
        {currentStep === 2 && (
          <Card variant="white" shadow="md" padding="lg">
            <h1 style={{ marginTop: 0 }}>Select Your Conditions</h1>
            <p style={{ color: '#737373' }}>
              Choose all conditions that apply to you.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {options.map(option => (
                <Checkbox
                  key={option.id}
                  id={option.id}
                  label={option.label}
                  description={option.description}
                  checked={selectedOptions.includes(option.id)}
                  onChange={(checked) => handleOptionChange(option.id, checked)}
                />
              ))}
            </div>

            {selectedOptions.length === 0 && (
              <p style={{ color: '#F59E0B', fontSize: '0.875rem', marginTop: '16px' }}>
                Please select at least one option to continue
              </p>
            )}
          </Card>
        )}

        {/* Step 3: Summary */}
        {currentStep === 3 && (
          <Card variant="primary" shadow="lg" padding="lg">
            <h1 style={{ marginTop: 0, color: 'white' }}>Review Your Information</h1>

            <Card variant="white" shadow="sm" padding="md" style={{ marginTop: '24px' }}>
              <h2 style={{ marginTop: 0 }}>Contact Information</h2>
              <p><strong>Name:</strong> {formData.name}</p>
              <p><strong>Email:</strong> {formData.email}</p>
              <p><strong>Phone:</strong> {formData.phone}</p>
            </Card>

            <Card variant="white" shadow="sm" padding="md" style={{ marginTop: '16px' }}>
              <h2 style={{ marginTop: 0 }}>Selected Conditions</h2>
              {selectedOptions.length > 0 ? (
                <ul style={{ paddingLeft: '24px' }}>
                  {selectedOptions.map(optionId => {
                    const option = options.find(opt => opt.id === optionId);
                    return (
                      <li key={optionId}>
                        {option?.label}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p>No conditions selected</p>
              )}
            </Card>
          </Card>
        )}

        {/* Navigation Buttons */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '24px',
            gap: '16px'
          }}
        >
          <Button
            variant="secondary"
            size="large"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            aria-label="Go to previous step"
          >
            Previous
          </Button>

          {currentStep < totalSteps ? (
            <Button
              variant="primary"
              size="large"
              onClick={handleNext}
              disabled={currentStep === 2 && selectedOptions.length === 0}
              aria-label="Continue to next step"
            >
              Next
            </Button>
          ) : (
            <Button
              variant="primary"
              size="large"
              onClick={handleSubmit}
              aria-label="Submit form"
            >
              Submit
            </Button>
          )}
        </div>

        {/* Interactive Cards Example */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '16px',
            marginTop: '32px'
          }}
        >
          <Card
            variant="white"
            shadow="md"
            hoverable
            onClick={() => alert('Card 1 clicked!')}
            aria-label="View option 1 details"
          >
            <h3 style={{ marginTop: 0 }}>Option 1</h3>
            <p>Click this card to select option 1</p>
          </Card>

          <Card
            variant="secondary"
            shadow="md"
            hoverable
            onClick={() => alert('Card 2 clicked!')}
            aria-label="View option 2 details"
          >
            <h3 style={{ marginTop: 0 }}>Option 2</h3>
            <p>Click this card to select option 2</p>
          </Card>

          <Card
            variant="white"
            shadow="md"
            hoverable
            disabled
            onClick={() => alert('This should not fire')}
            aria-label="Option 3 currently unavailable"
          >
            <h3 style={{ marginTop: 0 }}>Option 3</h3>
            <p>This option is currently disabled</p>
          </Card>
        </div>

        {/* Button Variants Example */}
        <Card variant="white" shadow="sm" padding="md" style={{ marginTop: '32px' }}>
          <h2 style={{ marginTop: 0 }}>Button Variants</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <Button
                variant="primary"
                size="large"
                onClick={() => alert('Primary button clicked')}
                aria-label="Primary action button"
              >
                Primary Large
              </Button>

              <Button
                variant="secondary"
                size="large"
                onClick={() => alert('Secondary button clicked')}
                aria-label="Secondary action button"
              >
                Secondary Large
              </Button>

              <Button
                variant="danger"
                size="large"
                onClick={() => alert('Danger button clicked')}
                aria-label="Dangerous action button"
              >
                Danger Large
              </Button>
            </div>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <Button
                variant="primary"
                size="small"
                onClick={() => alert('Small button clicked')}
                aria-label="Small primary button"
              >
                Primary Small
              </Button>

              <Button
                variant="secondary"
                size="small"
                onClick={() => alert('Small button clicked')}
                aria-label="Small secondary button"
              >
                Secondary Small
              </Button>

              <Button
                variant="primary"
                size="small"
                disabled
                onClick={() => alert('This should not fire')}
                aria-label="Disabled button"
              >
                Disabled
              </Button>
            </div>

            <Button
              variant="primary"
              size="large"
              fullWidth
              onClick={() => alert('Full width button clicked')}
              aria-label="Full width button"
            >
              Full Width Button
            </Button>
          </div>
        </Card>
      </PageTransition>
    </div>
  );
};
