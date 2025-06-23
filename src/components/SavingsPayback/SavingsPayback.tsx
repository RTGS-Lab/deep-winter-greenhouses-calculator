import React, { useState } from 'react';
import { SavingsData, CostBreakdown } from '../../types/calculator';
import { calculatePaybackPeriod } from '../../utils/calculations';
import './SavingsPayback.css';

interface SavingsPaybackProps {
  savingsData: SavingsData | null;
  costBreakdown: CostBreakdown;
  electricityPrice: number;
  isLoading: boolean;
}

const SavingsPayback: React.FC<SavingsPaybackProps> = ({
  savingsData,
  costBreakdown,
  electricityPrice,
  isLoading
}) => {
  const [sensitivityPrice, setSensitivityPrice] = useState(electricityPrice);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('en-US').format(Math.round(num));
  };

  const formatPercent = (num: number): string => {
    return `${num.toFixed(1)}%`;
  };

  if (isLoading || !savingsData) {
    return (
      <div className="savings-payback loading">
        <h2>Savings & Payback</h2>
        <p>{isLoading ? 'Calculating savings...' : 'Please complete configuration to see savings'}</p>
      </div>
    );
  }

  const adjustedSavings = {
    lower: savingsData.annualEnergySavingsKwh.lower * sensitivityPrice,
    upper: savingsData.annualEnergySavingsKwh.upper * sensitivityPrice
  };

  const paybackPeriod = calculatePaybackPeriod(
    costBreakdown.totalCost,
    adjustedSavings.lower,
    adjustedSavings.upper
  );

  const tenYearSavings = {
    lower: adjustedSavings.lower * 10 - costBreakdown.totalCost,
    upper: adjustedSavings.upper * 10 - costBreakdown.totalCost
  };

  return (
    <div className="savings-payback">
      <h2>Savings & Payback</h2>
      
      <div className="savings-overview">
        <div className="savings-item">
          <span className="label">Annual Energy Savings:</span>
          <span className="range">
            {formatNumber(savingsData.annualEnergySavingsKwh.lower)} - {formatNumber(savingsData.annualEnergySavingsKwh.upper)} kWh/yr
          </span>
        </div>
        
        <div className="savings-item">
          <span className="label">Annual Cost Savings:</span>
          <span className="range">
            {formatCurrency(savingsData.annualCostSavings.lower)} - {formatCurrency(savingsData.annualCostSavings.upper)}/yr
          </span>
        </div>
        
        <div className="savings-item">
          <span className="label">Energy Efficiency Improvement:</span>
          <span className="range">
            {formatPercent(savingsData.savingsPercentage.lower)} - {formatPercent(savingsData.savingsPercentage.upper)}
          </span>
        </div>
        
        <div className="savings-item payback">
          <span className="label">Simple Payback Period:</span>
          <span className="range">
            {paybackPeriod.lower === Infinity ? 'N/A' : `${paybackPeriod.lower} - ${paybackPeriod.upper} years`}
          </span>
        </div>
        
        <div className="savings-item">
          <span className="label">10-Year Net Savings:</span>
          <span className="range">
            {formatCurrency(tenYearSavings.lower)} - {formatCurrency(tenYearSavings.upper)}
          </span>
        </div>
      </div>

      <div className="sensitivity-analysis">
        <h3>Electricity Price Sensitivity</h3>
        <div className="price-slider-container">
          <label htmlFor="priceSlider">
            Electricity Price: ${sensitivityPrice.toFixed(3)}/kWh
          </label>
          <input
            type="range"
            id="priceSlider"
            min="0.05"
            max="0.50"
            step="0.005"
            value={sensitivityPrice}
            onChange={(e) => setSensitivityPrice(parseFloat(e.target.value))}
            className="price-slider"
          />
          <div className="slider-labels">
            <span>$0.05</span>
            <span>$0.50</span>
          </div>
        </div>
        
        {sensitivityPrice !== electricityPrice && (
          <div className="adjusted-savings">
            <div className="adjusted-item">
              <span className="label">Adjusted Annual Savings:</span>
              <span className="range">
                {formatCurrency(adjustedSavings.lower)} - {formatCurrency(adjustedSavings.upper)}/yr
              </span>
            </div>
            <div className="adjusted-item">
              <span className="label">Adjusted Payback Period:</span>
              <span className="range">
                {calculatePaybackPeriod(costBreakdown.totalCost, adjustedSavings.lower, adjustedSavings.upper).lower === Infinity 
                  ? 'N/A' 
                  : `${calculatePaybackPeriod(costBreakdown.totalCost, adjustedSavings.lower, adjustedSavings.upper).lower} - ${calculatePaybackPeriod(costBreakdown.totalCost, adjustedSavings.lower, adjustedSavings.upper).upper} years`}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="payback-timeline">
        <h3>Payback Timeline</h3>
        <div className="timeline-chart">
          {Array.from({ length: 11 }, (_, year) => {
            const cumulativeSavings = {
              lower: savingsData.annualCostSavings.lower * year - costBreakdown.totalCost,
              upper: savingsData.annualCostSavings.upper * year - costBreakdown.totalCost
            };
            
            return (
              <div key={year} className="timeline-year">
                <div className="year-label">Year {year}</div>
                <div className="savings-bar">
                  <div 
                    className={`bar ${cumulativeSavings.lower >= 0 ? 'positive' : 'negative'}`}
                    style={{
                      height: `${Math.min(100, Math.abs(cumulativeSavings.upper) / 100)}px`,
                      backgroundColor: cumulativeSavings.lower >= 0 ? '#28a745' : '#dc3545'
                    }}
                  />
                </div>
                <div className="savings-value">
                  {year === 0 ? formatCurrency(-costBreakdown.totalCost) : formatCurrency(cumulativeSavings.upper)}
                </div>
              </div>
            );
          })}
        </div>
        <div className="timeline-legend">
          <div className="legend-item">
            <div className="legend-color positive"></div>
            <span>Net Positive</span>
          </div>
          <div className="legend-item">
            <div className="legend-color negative"></div>
            <span>Net Negative</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavingsPayback;