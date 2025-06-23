import { SavingsData, CSVRow, CostBreakdown } from '../types/calculator';

export const calculateSavingsFromCSV = (
  row: CSVRow,
  electricityPrice: number
): SavingsData => {
  const parseNumber = (value: string): number => {
    const cleaned = value.replace(/[,$]/g, '');
    return parseFloat(cleaned) || 0;
  };

  const kwhLower = parseNumber(row['Predicted annual energy savings (kWh/yr)\n(lower)']);
  const kwhUpper = parseNumber(row['Predicted annual energy savings (kWh/yr)\n(upper)']);
  const btuLower = parseNumber(row['Predicted annual energy savings (Btu/yr)\n(lower)']);
  const btuUpper = parseNumber(row['Predicted annual energy savings (Btu/yr)\n(upper)']);
  const percentLower = parseNumber(row['Predicted savings (%)\n(lower)']);
  const percentUpper = parseNumber(row['Predicted savings (%)\n(upper)']);

  return {
    annualEnergySavingsKwh: {
      lower: kwhLower,
      upper: kwhUpper
    },
    annualEnergySavingsBtu: {
      lower: btuLower,
      upper: btuUpper
    },
    savingsPercentage: {
      lower: percentLower,
      upper: percentUpper
    },
    annualCostSavings: {
      lower: kwhLower * electricityPrice,
      upper: kwhUpper * electricityPrice
    }
  };
};

export const estimateConstructionCosts = (
  rockbedHeight: string,
  foundationInsulation: string,
  insulationBelowRockbed: string
): CostBreakdown => {
  const heightMultiplier = getHeightMultiplier(rockbedHeight);
  const insulationCost = getInsulationCosts(foundationInsulation, insulationBelowRockbed);
  
  const baseMaterialsCost = 5000;
  const baseLaborCost = 3000;
  
  const materialsCode = baseMaterialsCost * heightMultiplier + insulationCost;
  const laborCost = baseLaborCost * heightMultiplier;
  const totalCost = materialsCode + laborCost;
  
  const assumedGreenhouseSize = 1000;
  const costPerSqFt = totalCost / assumedGreenhouseSize;
  
  return {
    materialsCode,
    laborCost,
    totalCost,
    costPerSqFt
  };
};

const getHeightMultiplier = (height: string): number => {
  switch (height) {
    case "3'-9''":
    case "6'-0''":
      return 0.8;
    case "7'-6''":
      return 1.0;
    case "9'-0''":
      return 1.3;
    default:
      return 1.0;
  }
};

const getInsulationCosts = (foundation: string, belowRockbed: string): number => {
  let cost = 0;
  
  if (foundation.includes('R-10')) cost += 800;
  else if (foundation.includes('R-20')) cost += 1200;
  else if (foundation.includes('R-5')) cost += 400;
  
  if (belowRockbed.includes('R-5')) cost += 600;
  
  return cost;
};

export const calculatePaybackPeriod = (
  totalCost: number,
  annualSavingsLower: number,
  annualSavingsUpper: number
): { lower: number; upper: number } => {
  const paybackLower = annualSavingsUpper > 0 ? totalCost / annualSavingsUpper : Infinity;
  const paybackUpper = annualSavingsLower > 0 ? totalCost / annualSavingsLower : Infinity;
  
  return {
    lower: Math.round(paybackLower * 10) / 10,
    upper: Math.round(paybackUpper * 10) / 10
  };
};