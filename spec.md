# Specification
This is a tool to help growers evaluate the potential benefits of
investing in a rockbed for their deep winter greenhouse.

It is driven by a lookup table.

# Technology
- The website will be hosted as a GitHub page out of the root directory on the master branch.
- It should be a stand-alone app driven by the csv 'dwg_simulation_lookup.csv' that contains processed
outputs from modeling work done by Jenn Hoody.
- It should be written in REACT with Typescript, HTML, and CSS
- The layout should have four components with a 2x2 grid in desktop mode. In mobile it should be stacked.
- App components: 1) project configuration that contains location, soil type, rockbed type with the default location being central Minnesota, unknown soil type, and 7'-6" rockbed height. 2) Insulation configuration: foundation insulation default r value of R-5, insulation above rockbed: soil, insulation below rockbed, R-5, Additional inlet insulation: null, electricity price ($/kWh) default 0.145. 3) Cost summary for construction, and 4) predicted annual savings and payback period.
- Each component and its styling should be in the components folder.

# Local Prototyping
- For local prototyping, I'll use vite dev to launch.

# Directory Structure

```
deep-winter-greenhouses-calculator/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── dwg_simulation_lookup.csv
├── src/
│   ├── components/
│   │   ├── ProjectConfiguration/
│   │   │   ├── ProjectConfiguration.tsx
│   │   │   └── ProjectConfiguration.css
│   │   ├── InsulationConfiguration/
│   │   │   ├── InsulationConfiguration.tsx
│   │   │   └── InsulationConfiguration.css
│   │   ├── CostSummary/
│   │   │   ├── CostSummary.tsx
│   │   │   └── CostSummary.css
│   │   └── SavingsPayback/
│   │       ├── SavingsPayback.tsx
│   │       └── SavingsPayback.css
│   ├── types/
│   │   └── calculator.ts
│   ├── utils/
│   │   ├── csvParser.ts
│   │   └── calculations.ts
│   ├── App.tsx
│   ├── App.css
│   ├── main.tsx
│   └── vite-env.d.ts
├── package.json
├── tsconfig.json
├── vite.config.ts
├── .gitignore
└── README.md
```

# Component Specifications

## 1. ProjectConfiguration Component

**Purpose**: Configure the basic project parameters that affect rockbed sizing and thermal performance.

**Data Source**: Dynamically populated from `dwg_simulation_lookup.csv` columns:
- Location (column 1)
- Soil Type (column 2) 
- Rockbed height (column 3)

**Fields**:
- **Location** (dropdown): Geographic location for climate data
  - Default: First available location containing "Central" or "Minnesota", fallback to first location
  - Options: Unique values from CSV "Location" column, sorted alphabetically
- **Soil Type** (dropdown): Type of soil surrounding the greenhouse
  - Default: First available option, or "Unknown" if present
  - Options: Unique values from CSV "Soil Type" column
- **Rockbed Height** (dropdown): Vertical dimension of the rockbed thermal mass
  - Default: "7'-6''" if available, otherwise first option
  - Options: Unique values from CSV "Rockbed height" column, sorted by height

**Dynamic Filtering**: 
- When Location changes, filter available Soil Type and Rockbed Height options to only show combinations that exist in the CSV
- When Soil Type changes, filter available Rockbed Height options
- Disable invalid combinations and show validation messages

**Layout**:
- Form layout with labeled dropdowns
- Loading state while CSV is being parsed
- Clear visual hierarchy with section title
- Validation indicators for invalid combinations

## 2. InsulationConfiguration Component

**Purpose**: Configure insulation parameters that affect thermal performance and costs.

**Data Source**: Dynamically populated from `dwg_simulation_lookup.csv` columns:
- Foundation insulation (column 4)
- Insulation above rockbed (column 5)
- Insulation below rockbed (column 6)
- Additional inlet insulation (column 7)

**Fields**:
- **Foundation Insulation** (dropdown): R-value of foundation insulation
  - Default: "R-5"
  - Options: Unique values from CSV "Foundation insulation" column
- **Insulation Above Rockbed** (dropdown): Type/R-value above rockbed
  - Default: "Soil"
  - Options: Unique values from CSV "Insulation above rockbed" column
- **Insulation Below Rockbed** (dropdown): R-value below rockbed
  - Default: "R-5"
  - Options: Unique values from CSV "Insulation below rockbed" column
- **Additional Inlet Insulation** (dropdown): Extra inlet insulation
  - Default: "-" (none)
  - Options: Unique values from CSV "Additional inlet insulation" column
- **Electricity Price** (number input): Cost per kWh
  - Default: 0.145
  - Range: 0.05 to 0.50
  - Format: $0.000/kWh

**Dynamic Filtering**:
- Filter available insulation options based on ProjectConfiguration selections
- Show only combinations that exist in the CSV data
- Update cost calculations when electricity price changes

## 3. CostSummary Component

**Purpose**: Display estimated construction costs for the selected rockbed configuration.

**Data Sources**:
- Material costs based on rockbed dimensions and insulation selections
- Labor cost estimates
- Cost lookup tables (may need separate CSV or embedded in main lookup)

**Display Fields**:
- **Materials Cost**: Breakdown by category (excavation, rockbed materials, insulation, etc.)
- **Labor Cost**: Estimated installation labor
- **Total Project Cost**: Sum of materials and labor
- **Cost per Square Foot**: Normalized cost metric

**Features**:
- Itemized cost breakdown with expand/collapse details
- Update automatically when configuration changes
- Export cost summary option

## 4. SavingsPayback Component

**Purpose**: Display predicted energy savings and payback period calculations.

**Data Source**: Results from `dwg_simulation_lookup.csv` based on selected configuration:
- Predicted annual energy savings (kWh/yr) - columns 8-11
- Predicted savings (%) - columns 12-13  
- Predicted cost savings ($/yr) - columns 14-15

**Display Fields**:
- **Annual Energy Savings**: kWh/year range (lower-upper bounds)
- **Annual Cost Savings**: Dollar amount based on electricity price
- **Percentage Savings**: Efficiency improvement percentage
- **Simple Payback Period**: Total cost ÷ annual savings
- **10-Year Net Savings**: Long-term financial benefit

**Features**:
- Range display for uncertain values (show confidence intervals)
- Sensitivity analysis slider for electricity price
- Graphical representation of payback timeline
- Update automatically when any configuration changes

**Calculations**:
- Use electricity price from InsulationConfiguration
- Interpolate between lower/upper bounds from CSV
- Calculate payback period: Total Project Cost ÷ Annual Cost Savings

