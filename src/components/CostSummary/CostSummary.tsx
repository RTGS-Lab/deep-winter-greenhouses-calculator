import React, { useState } from 'react';
import { CostBreakdown } from '../../types/calculator';
import './CostSummary.css';

interface CostSummaryProps {
  costBreakdown: CostBreakdown;
  isLoading: boolean;
}

const CostSummary: React.FC<CostSummaryProps> = ({ costBreakdown, isLoading }) => {
  const [showDetails, setShowDetails] = useState(false);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="cost-summary loading">
        <h2>Cost Summary</h2>
        <p>Calculating costs...</p>
      </div>
    );
  }

  return (
    <div className="cost-summary">
      <h2>Cost Summary</h2>
      
      <div className="cost-overview">
        <div className="total-cost">
          <span className="label">Total Project Cost:</span>
          <span className="amount">{formatCurrency(costBreakdown.totalCost)}</span>
        </div>
        
        <div className="cost-per-sqft">
          <span className="label">Cost per Square Foot:</span>
          <span className="amount">{formatCurrency(costBreakdown.costPerSqFt)}</span>
        </div>
      </div>

      <button 
        className="details-toggle"
        onClick={() => setShowDetails(!showDetails)}
      >
        {showDetails ? 'Hide Details' : 'Show Details'} ▼
      </button>

      {showDetails && (
        <div className="cost-details">
          <h3>Cost Breakdown</h3>
          
          <div className="cost-item">
            <span className="item-label">Materials:</span>
            <span className="item-amount">{formatCurrency(costBreakdown.materialsCode)}</span>
          </div>
          
          <div className="cost-item">
            <span className="item-label">Labor:</span>
            <span className="item-amount">{formatCurrency(costBreakdown.laborCost)}</span>
          </div>
          
          <div className="cost-item total">
            <span className="item-label">Total:</span>
            <span className="item-amount">{formatCurrency(costBreakdown.totalCost)}</span>
          </div>
          
          <div className="cost-notes">
            <h4>Notes:</h4>
            <ul>
              <li>Material costs include excavation, rockbed materials, and insulation</li>
              <li>Labor costs are estimated based on typical installation rates</li>
              <li>Actual costs may vary based on local conditions and contractors</li>
              <li>Cost per sq ft assumes 1,000 sq ft greenhouse</li>
            </ul>
          </div>
        </div>
      )}

      <div className="export-section">
        <button 
          className="export-button"
          onClick={() => {
            const data = {
              totalCost: costBreakdown.totalCost,
              materialsCode: costBreakdown.materialsCode,
              laborCost: costBreakdown.laborCost,
              costPerSqFt: costBreakdown.costPerSqFt,
              generatedAt: new Date().toISOString()
            };
            
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'greenhouse-cost-summary.json';
            a.click();
            URL.revokeObjectURL(url);
          }}
        >
          Export Summary
        </button>
      </div>
    </div>
  );
};

export default CostSummary;