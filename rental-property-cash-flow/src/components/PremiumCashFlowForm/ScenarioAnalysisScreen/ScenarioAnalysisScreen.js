import React, { useState } from 'react';
import './ScenarioAnalysisScreen.css';

const ScenarioAnalysisScreen = ({ formData, results, updateFormData, formatCurrency }) => {
  const [scenarios, setScenarios] = useState([{ id: 1, name: 'Base Case', data: formData }]);

  const handleScenarioChange = (id, field, value) => {
    setScenarios((prevScenarios) =>
      prevScenarios.map((scenario) =>
        scenario.id === id
          ? { ...scenario, data: { ...scenario.data, [field]: parseFloat(value) } }
          : scenario
      )
    );
  };

  const addScenario = () => {
    setScenarios([
      ...scenarios,
      { id: scenarios.length + 1, name: `Scenario ${scenarios.length + 1}`, data: formData },
    ]);
  };

  const deleteScenario = (id) => {
    setScenarios(scenarios.filter((scenario) => scenario.id !== id));
  };

  const applyScenario = (data) => {
    updateFormData(data);
  };

  return (
    <div className="scenario-analysis-container">
      <h2>Scenario Analysis</h2>
      <div className="scenarios">
        {scenarios.map((scenario) => (
          <div key={scenario.id} className="scenario">
            <div className="scenario-header">
              <h3>{scenario.name}</h3>
              <button onClick={() => deleteScenario(scenario.id)}>Delete</button>
            </div>
            <div className="scenario-body">
              {Object.keys(scenario.data).map((field) => (
                <div key={field} className="scenario-field">
                  <label>{field}</label>
                  <input
                    type="number"
                    value={scenario.data[field]}
                    onChange={(e) =>
                      handleScenarioChange(scenario.id, field, e.target.value)
                    }
                  />
                </div>
              ))}
            </div>
            <button className="apply-scenario-button" onClick={() => applyScenario(scenario.data)}>
              Apply Scenario
            </button>
          </div>
        ))}
      </div>
      <button className="add-scenario-button" onClick={addScenario}>
        Add Scenario
      </button>
    </div>
  );
};

export default ScenarioAnalysisScreen;
