export interface ProjectConfig {
  location: string;
  soilType: string;
  rockbedHeight: string;
}

export interface InsulationConfig {
  foundationInsulation: string;
  insulationAboveRockbed: string;
  insulationBelowRockbed: string;
  additionalInletInsulation: string;
  electricityPrice: number;
}

export interface CostBreakdown {
  materialsCode: number;
  laborCost: number;
  totalCost: number;
  costPerSqFt: number;
}

export interface SavingsData {
  annualEnergySavingsKwh: {
    lower: number;
    upper: number;
  };
  annualEnergySavingsBtu: {
    lower: number;
    upper: number;
  };
  savingsPercentage: {
    lower: number;
    upper: number;
  };
  annualCostSavings: {
    lower: number;
    upper: number;
  };
}

export interface CalculatorState {
  projectConfig: ProjectConfig;
  insulationConfig: InsulationConfig;
  costBreakdown: CostBreakdown;
  savingsData: SavingsData | null;
  isLoading: boolean;
  error: string | null;
}

export interface CSVRow {
  Location: string;
  'Soil Type': string;
  'Rockbed height': string;
  'Foundation insulation': string;
  'Insulation above rockbed': string;
  'Insulation below rockbed': string;
  'Additional inlet insulation': string;
  'Predicted annual energy savings (kWh/yr)\n(lower)': string;
  'Predicted annual energy savings (kWh/yr)\n(upper)': string;
  'Predicted annual energy savings (Btu/yr)\n(lower)': string;
  'Predicted annual energy savings (Btu/yr)\n(upper)': string;
  'Predicted savings (%)\n(lower)': string;
  'Predicted savings (%)\n(upper)': string;
  'Predicted cost savings ($/yr)\n(lower)': string;
  'Predicted cost savings ($/yr)\n(upper)': string;
  'Predicted savings (%)': string;
}

export interface FilteredOptions {
  locations: string[];
  soilTypes: string[];
  rockbedHeights: string[];
  foundationInsulations: string[];
  insulationAboveRockbed: string[];
  insulationBelowRockbed: string[];
  additionalInletInsulations: string[];
}