import React from 'react';
import { InsulationConfig, FilteredOptions } from '../../types/calculator';
import './InsulationConfiguration.css';

interface InsulationConfigurationProps {
  config: InsulationConfig;
  options: FilteredOptions;
  isLoading: boolean;
  onChange: (config: InsulationConfig) => void;
}

const InsulationConfiguration: React.FC<InsulationConfigurationProps> = ({
  config,
  options,
  isLoading,
  onChange
}) => {
  const handleFoundationInsulationChange = (foundationInsulation: string) => {
    onChange({ ...config, foundationInsulation });
  };

  const handleInsulationAboveRockbedChange = (insulationAboveRockbed: string) => {
    onChange({ ...config, insulationAboveRockbed });
  };

  const handleInsulationBelowRockbedChange = (insulationBelowRockbed: string) => {
    onChange({ ...config, insulationBelowRockbed });
  };

  const handleAdditionalInletInsulationChange = (additionalInletInsulation: string) => {
    onChange({ ...config, additionalInletInsulation });
  };

  const handleElectricityPriceChange = (electricityPrice: number) => {
    onChange({ ...config, electricityPrice });
  };

  if (isLoading) {
    return (
      <div className="insulation-configuration loading">
        <h2>Insulation Configuration</h2>
        <p>Loading options...</p>
      </div>
    );
  }

  return (
    <div className="insulation-configuration">
      <h2>Insulation Configuration</h2>
      
      <div className="form-group">
        <label htmlFor="foundationInsulation">Foundation Insulation:</label>
        <select
          id="foundationInsulation"
          value={config.foundationInsulation}
          onChange={(e) => handleFoundationInsulationChange(e.target.value)}
        >
          <option value="">Select insulation...</option>
          {options.foundationInsulations.map((insulation) => (
            <option key={insulation} value={insulation}>
              {insulation}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="insulationAboveRockbed">Insulation Above Rockbed:</label>
        <select
          id="insulationAboveRockbed"
          value={config.insulationAboveRockbed}
          onChange={(e) => handleInsulationAboveRockbedChange(e.target.value)}
        >
          <option value="">Select insulation...</option>
          {options.insulationAboveRockbed.map((insulation) => (
            <option key={insulation} value={insulation}>
              {insulation}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="insulationBelowRockbed">Insulation Below Rockbed:</label>
        <select
          id="insulationBelowRockbed"
          value={config.insulationBelowRockbed}
          onChange={(e) => handleInsulationBelowRockbedChange(e.target.value)}
        >
          <option value="">Select insulation...</option>
          {options.insulationBelowRockbed.map((insulation) => (
            <option key={insulation} value={insulation}>
              {insulation}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="additionalInletInsulation">Additional Inlet Insulation:</label>
        <select
          id="additionalInletInsulation"
          value={config.additionalInletInsulation}
          onChange={(e) => handleAdditionalInletInsulationChange(e.target.value)}
        >
          <option value="">Select insulation...</option>
          {options.additionalInletInsulations.map((insulation) => (
            <option key={insulation} value={insulation}>
              {insulation === '-' ? 'None' : insulation}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="electricityPrice">Electricity Price ($/kWh):</label>
        <input
          type="number"
          id="electricityPrice"
          value={config.electricityPrice}
          onChange={(e) => handleElectricityPriceChange(parseFloat(e.target.value) || 0)}
          min="0.05"
          max="0.50"
          step="0.001"
          placeholder="0.145"
        />
        <small className="help-text">
          Enter your local electricity rate (default: $0.145/kWh)
        </small>
      </div>
    </div>
  );
};

export default InsulationConfiguration;