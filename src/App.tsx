import React, { useState, useEffect } from 'react';
import ProjectConfiguration from './components/ProjectConfiguration/ProjectConfiguration';
import InsulationConfiguration from './components/InsulationConfiguration/InsulationConfiguration';
import CostSummary from './components/CostSummary/CostSummary';
import SavingsPayback from './components/SavingsPayback/SavingsPayback';
import { 
  CalculatorState, 
  ProjectConfig, 
  InsulationConfig, 
  CSVRow, 
  FilteredOptions 
} from './types/calculator';
import { 
  loadCSVData, 
  getFilteredOptions, 
  getFilteredOptionsForConfig, 
  findMatchingRow 
} from './utils/csvParser';
import { 
  calculateSavingsFromCSV, 
  estimateConstructionCosts 
} from './utils/calculations';
import './App.css';

const defaultProjectConfig: ProjectConfig = {
  location: '',
  soilType: '',
  rockbedHeight: ''
};

const defaultInsulationConfig: InsulationConfig = {
  foundationInsulation: '',
  insulationAboveRockbed: '',
  insulationBelowRockbed: '',
  additionalInletInsulation: '',
  electricityPrice: 0.145
};

const App: React.FC = () => {
  const [csvData, setCsvData] = useState<CSVRow[]>([]);
  const [allOptions, setAllOptions] = useState<FilteredOptions>({
    locations: [],
    soilTypes: [],
    rockbedHeights: [],
    foundationInsulations: [],
    insulationAboveRockbed: [],
    insulationBelowRockbed: [],
    additionalInletInsulations: []
  });

  const [state, setState] = useState<CalculatorState>({
    projectConfig: defaultProjectConfig,
    insulationConfig: defaultInsulationConfig,
    costBreakdown: {
      materialsCode: 0,
      laborCost: 0,
      totalCost: 0,
      costPerSqFt: 0
    },
    savingsData: null,
    isLoading: true,
    error: null
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        const data = await loadCSVData();
        setCsvData(data);
        
        const options = getFilteredOptions(data);
        setAllOptions(options);
        
        const initialProjectConfig: ProjectConfig = {
          location: options.locations.find(loc => loc.toLowerCase().includes('central') || loc.toLowerCase().includes('minnesota')) || options.locations[0] || '',
          soilType: options.soilTypes.find(type => type.toLowerCase().includes('unknown')) || options.soilTypes[0] || '',
          rockbedHeight: options.rockbedHeights.find(height => height.includes("7'-6")) || options.rockbedHeights[0] || ''
        };
        
        const initialInsulationConfig: InsulationConfig = {
          foundationInsulation: options.foundationInsulations.find(ins => ins.includes('R-5')) || options.foundationInsulations[0] || '',
          insulationAboveRockbed: options.insulationAboveRockbed.find(ins => ins.toLowerCase().includes('soil')) || options.insulationAboveRockbed[0] || '',
          insulationBelowRockbed: options.insulationBelowRockbed.find(ins => ins.includes('R-5')) || options.insulationBelowRockbed[0] || '',
          additionalInletInsulation: options.additionalInletInsulations.find(ins => ins === '-') || options.additionalInletInsulations[0] || '',
          electricityPrice: 0.145
        };
        
        setState(prev => ({
          ...prev,
          projectConfig: initialProjectConfig,
          insulationConfig: initialInsulationConfig,
          isLoading: false
        }));
        
      } catch (error) {
        console.error('Failed to load CSV data:', error);
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Failed to load data. Please check that the CSV file is available.'
        }));
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (csvData.length === 0) return;
    
    const { projectConfig, insulationConfig } = state;
    
    if (projectConfig.location && projectConfig.soilType && projectConfig.rockbedHeight &&
        insulationConfig.foundationInsulation && insulationConfig.insulationAboveRockbed &&
        insulationConfig.insulationBelowRockbed && insulationConfig.additionalInletInsulation) {
      
      const matchingRow = findMatchingRow(
        csvData,
        projectConfig.location,
        projectConfig.soilType,
        projectConfig.rockbedHeight,
        insulationConfig.foundationInsulation,
        insulationConfig.insulationAboveRockbed,
        insulationConfig.insulationBelowRockbed,
        insulationConfig.additionalInletInsulation
      );
      
      if (matchingRow) {
        const savingsData = calculateSavingsFromCSV(matchingRow, insulationConfig.electricityPrice);
        const costBreakdown = estimateConstructionCosts(
          projectConfig.rockbedHeight,
          insulationConfig.foundationInsulation,
          insulationConfig.insulationBelowRockbed
        );
        
        setState(prev => ({
          ...prev,
          savingsData,
          costBreakdown
        }));
      } else {
        setState(prev => ({
          ...prev,
          savingsData: null,
          costBreakdown: {
            materialsCode: 0,
            laborCost: 0,
            totalCost: 0,
            costPerSqFt: 0
          }
        }));
      }
    }
  }, [state.projectConfig, state.insulationConfig, csvData]);

  const getFilteredOptionsForCurrentConfig = (): FilteredOptions => {
    if (csvData.length === 0) return allOptions;
    
    return getFilteredOptionsForConfig(
      csvData,
      state.projectConfig.location || undefined,
      state.projectConfig.soilType || undefined,
      state.projectConfig.rockbedHeight || undefined,
      state.insulationConfig.foundationInsulation || undefined,
      state.insulationConfig.insulationAboveRockbed || undefined,
      state.insulationConfig.insulationBelowRockbed || undefined
    );
  };

  const handleProjectConfigChange = (config: ProjectConfig) => {
    setState(prev => ({ ...prev, projectConfig: config }));
  };

  const handleInsulationConfigChange = (config: InsulationConfig) => {
    setState(prev => ({ ...prev, insulationConfig: config }));
  };

  if (state.error) {
    return (
      <div className="app error">
        <div className="error-message">
          <h1>Error Loading Application</h1>
          <p>{state.error}</p>
          <button onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Deep Winter Greenhouse Calculator</h1>
        <p>Evaluate the potential benefits of investing in a rockbed for your deep winter greenhouse</p>
      </header>
      
      <main className="app-main">
        <div className="calculator-grid">
          <ProjectConfiguration
            config={state.projectConfig}
            options={getFilteredOptionsForCurrentConfig()}
            isLoading={state.isLoading}
            onChange={handleProjectConfigChange}
          />
          
          <InsulationConfiguration
            config={state.insulationConfig}
            options={getFilteredOptionsForCurrentConfig()}
            isLoading={state.isLoading}
            onChange={handleInsulationConfigChange}
          />
          
          <CostSummary
            costBreakdown={state.costBreakdown}
            isLoading={state.isLoading || !state.savingsData}
          />
          
          <SavingsPayback
            savingsData={state.savingsData}
            costBreakdown={state.costBreakdown}
            electricityPrice={state.insulationConfig.electricityPrice}
            isLoading={state.isLoading || !state.savingsData}
          />
        </div>
      </main>
      
      <footer className="app-footer">
        <p>
          Data based on modeling work by Jenn Hoody. 
          This tool provides estimates for planning purposes only.
        </p>
      </footer>
    </div>
  );
};

export default App;