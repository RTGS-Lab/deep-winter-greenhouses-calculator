import { CSVRow, FilteredOptions } from '../types/calculator';

export const parseCSV = (csvText: string): CSVRow[] => {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
  
  const rows: CSVRow[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim() === '' || line.startsWith('#')) continue;
    
    const values = parseCSVLine(line);
    if (values.length < headers.length) continue;
    
    const row: any = {};
    headers.forEach((header, index) => {
      row[header] = values[index]?.replace(/"/g, '').trim() || '';
    });
    
    if (row.Location && row['Soil Type'] && row['Rockbed height']) {
      rows.push(row as CSVRow);
    }
  }
  
  return rows;
};

const parseCSVLine = (line: string): string[] => {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current);
  return result;
};

export const loadCSVData = async (): Promise<CSVRow[]> => {
  try {
    const response = await fetch('/dwg_simulation_lookup.csv');
    if (!response.ok) {
      throw new Error(`Failed to load CSV: ${response.statusText}`);
    }
    const csvText = await response.text();
    return parseCSV(csvText);
  } catch (error) {
    console.error('Error loading CSV data:', error);
    throw error;
  }
};

export const getFilteredOptions = (data: CSVRow[]): FilteredOptions => {
  const locations = [...new Set(data.map(row => row.Location))].sort();
  const soilTypes = [...new Set(data.map(row => row['Soil Type']))].sort();
  const rockbedHeights = [...new Set(data.map(row => row['Rockbed height']))].sort();
  const foundationInsulations = [...new Set(data.map(row => row['Foundation insulation']))].sort();
  const insulationAboveRockbed = [...new Set(data.map(row => row['Insulation above rockbed']))].sort();
  const insulationBelowRockbed = [...new Set(data.map(row => row['Insulation below rockbed']))].sort();
  const additionalInletInsulations = [...new Set(data.map(row => row['Additional inlet insulation']))].sort();
  
  return {
    locations,
    soilTypes,
    rockbedHeights,
    foundationInsulations,
    insulationAboveRockbed,
    insulationBelowRockbed,
    additionalInletInsulations
  };
};

export const getFilteredOptionsForConfig = (
  data: CSVRow[],
  location?: string,
  soilType?: string,
  rockbedHeight?: string,
  foundationInsulation?: string,
  insulationAboveRockbed?: string,
  insulationBelowRockbed?: string
): FilteredOptions => {
  let filteredData = data;
  
  if (location) {
    filteredData = filteredData.filter(row => row.Location === location);
  }
  if (soilType) {
    filteredData = filteredData.filter(row => row['Soil Type'] === soilType);
  }
  if (rockbedHeight) {
    filteredData = filteredData.filter(row => row['Rockbed height'] === rockbedHeight);
  }
  if (foundationInsulation) {
    filteredData = filteredData.filter(row => row['Foundation insulation'] === foundationInsulation);
  }
  if (insulationAboveRockbed) {
    filteredData = filteredData.filter(row => row['Insulation above rockbed'] === insulationAboveRockbed);
  }
  if (insulationBelowRockbed) {
    filteredData = filteredData.filter(row => row['Insulation below rockbed'] === insulationBelowRockbed);
  }
  
  return getFilteredOptions(filteredData);
};

export const findMatchingRow = (
  data: CSVRow[],
  location: string,
  soilType: string,
  rockbedHeight: string,
  foundationInsulation: string,
  insulationAboveRockbed: string,
  insulationBelowRockbed: string,
  additionalInletInsulation: string
): CSVRow | null => {
  return data.find(row => 
    row.Location === location &&
    row['Soil Type'] === soilType &&
    row['Rockbed height'] === rockbedHeight &&
    row['Foundation insulation'] === foundationInsulation &&
    row['Insulation above rockbed'] === insulationAboveRockbed &&
    row['Insulation below rockbed'] === insulationBelowRockbed &&
    row['Additional inlet insulation'] === additionalInletInsulation
  ) || null;
};