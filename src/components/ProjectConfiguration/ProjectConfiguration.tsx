import React from 'react';
import { ProjectConfig, FilteredOptions } from '../../types/calculator';
import './ProjectConfiguration.css';

interface ProjectConfigurationProps {
  config: ProjectConfig;
  options: FilteredOptions;
  isLoading: boolean;
  onChange: (config: ProjectConfig) => void;
}

const ProjectConfiguration: React.FC<ProjectConfigurationProps> = ({
  config,
  options,
  isLoading,
  onChange
}) => {
  const handleLocationChange = (location: string) => {
    onChange({ ...config, location });
  };

  const handleSoilTypeChange = (soilType: string) => {
    onChange({ ...config, soilType });
  };

  const handleRockbedHeightChange = (rockbedHeight: string) => {
    onChange({ ...config, rockbedHeight });
  };

  if (isLoading) {
    return (
      <div className="project-configuration loading">
        <h2>Project Configuration</h2>
        <p>Loading options...</p>
      </div>
    );
  }

  return (
    <div className="project-configuration">
      <h2>Project Configuration</h2>
      
      <div className="form-group">
        <label htmlFor="location">Location:</label>
        <select
          id="location"
          value={config.location}
          onChange={(e) => handleLocationChange(e.target.value)}
        >
          <option value="">Select location...</option>
          {options.locations.map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="soilType">Soil Type:</label>
        <select
          id="soilType"
          value={config.soilType}
          onChange={(e) => handleSoilTypeChange(e.target.value)}
          disabled={!config.location}
        >
          <option value="">Select soil type...</option>
          {options.soilTypes.map((soilType) => (
            <option key={soilType} value={soilType}>
              {soilType}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="rockbedHeight">Rockbed Height:</label>
        <select
          id="rockbedHeight"
          value={config.rockbedHeight}
          onChange={(e) => handleRockbedHeightChange(e.target.value)}
          disabled={!config.location || !config.soilType}
        >
          <option value="">Select height...</option>
          {options.rockbedHeights.map((height) => (
            <option key={height} value={height}>
              {height}
            </option>
          ))}
        </select>
      </div>

      {(!config.location || !config.soilType || !config.rockbedHeight) && (
        <div className="validation-message">
          Please select all configuration options to see results.
        </div>
      )}
    </div>
  );
};

export default ProjectConfiguration;