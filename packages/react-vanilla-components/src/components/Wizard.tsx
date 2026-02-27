import React, { useState, useCallback } from "react";
import { FormNodeView } from "../form-context/types";
import Accordion from "./Accordion";
import { FormNode } from "../form-context/types";

interface WizardProps {
  form: FormNodeView;
  renderField: (node: FormNode) => React.ReactNode;
}

export default function Wizard({ form, renderField }: WizardProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = form.items?.filter((item) => item.type === "wizardStep") || [];

  const goToStep = useCallback((stepIdx: number) => {
    setCurrentStep(stepIdx);
  }, []);

  const goNext = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  }, [steps.length]);
  const goPrev = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  return (
    <div className="wizard-container">
      <div className="wizard-nav">
        {steps.map((step, idx) => (
          <button
            key={step.id}
            className={`wizard-nav-step${idx === currentStep ? " active" : ""}`}
            onClick={() => goToStep(idx)}
            disabled={idx > currentStep}
            type="button"
            aria-current={idx === currentStep ? "step" : undefined}
          >
            {step.label || `Step ${idx + 1}`}
          </button>
        ))}
      </div>
      <div className="wizard-content">
        {steps[currentStep] && (
          <Accordion
            key={steps[currentStep].id}
            node={steps[currentStep]}
            open={true}
            parentOpen={true}
            renderField={renderField}
          />
        )}
      </div>
      <div className="wizard-actions">
        <button onClick={goPrev} disabled={currentStep === 0} type="button">
          Previous
        </button>
        <button onClick={goNext} disabled={currentStep === steps.length - 1} type="button">
          Next
        </button>
      </div>
    </div>
  );
}
