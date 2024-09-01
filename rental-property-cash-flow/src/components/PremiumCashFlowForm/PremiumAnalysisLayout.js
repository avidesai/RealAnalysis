import React, { useState } from 'react';
import PremiumCashFlowForm from './PremiumCashFlowForm';
import ScenarioAnalysisScreen from './ScenarioAnalysisScreen/ScenarioAnalysisScreen'; // Import the scenario analysis component
import MultiYearProjections from './MultiYearProjections/MultiYearProjections'; // Import multi-year projections component
import './PremiumAnalysisLayout.css';

const PremiumAnalysisLayout = () => {
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [formData, setFormData] = useState({}); // Initialize with empty object
  const [results, setResults] = useState({});

  const handleCalculate = (newData, newResults) => {
    setFormData(newData);
    setResults(newResults);
    setShowAnalysis(true); // Show analysis when calculate is clicked
  };

  return (
    <div className="premium-analysis-layout">
      <div className={`form-container ${showAnalysis ? 'compact' : ''}`}>
        <PremiumCashFlowForm onCalculate={handleCalculate} />
      </div>
      {showAnalysis && results && (
        <div className="analysis-container">
          <ScenarioAnalysisScreen
            formData={formData}
            results={results}
            updateFormData={setFormData}
            formatCurrency={results.formatCurrency}
          />
          <MultiYearProjections
            formData={formData}
            results={results}
            formatCurrency={results.formatCurrency}
          />
        </div>
      )}
    </div>
  );
};

export default PremiumAnalysisLayout;
