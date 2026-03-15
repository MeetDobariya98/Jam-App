import React from 'react';
import './Admin.css';

const QUICK = [
  { label: 'Today',      days: 0 },
  { label: 'Yesterday',  days: 1 },
  { label: 'Last 7d',   days: 6 },
  { label: 'Last 30d',  days: 29 },
  { label: 'This Month', days: null, thisMonth: true },
];

const fmt = (d) => d.toISOString().split('T')[0]; // YYYY-MM-DD

const DateFilter = ({ startDate, endDate, onStartDate, onEndDate, extra }) => {

  const applyQuick = (q) => {
    const end = new Date();
    let start = new Date();
    if (q.thisMonth) {
      start = new Date(end.getFullYear(), end.getMonth(), 1);
    } else if (q.days === 1) {
      start.setDate(start.getDate() - 1);
      end.setDate(end.getDate() - 1);
    } else {
      start.setDate(start.getDate() - q.days);
    }
    onStartDate(fmt(start));
    onEndDate(fmt(end));
  };

  const clearDates = () => { onStartDate(''); onEndDate(''); };

  return (
    <div className="date-filter-bar">
      {/* Quick picks */}
      <div className="date-quick-btns">
        {QUICK.map(q => (
          <button
            key={q.label}
            className="date-quick-btn"
            onClick={() => applyQuick(q)}
          >
            {q.label}
          </button>
        ))}
        {(startDate || endDate) && (
          <button className="date-quick-btn clear-btn" onClick={clearDates}>
            ✕ Clear
          </button>
        )}
      </div>

      {/* Manual date range */}
      <div className="date-range-inputs">
        <div className="date-input-wrap">
          <span className="date-input-label">From</span>
          <input
            type="date"
            className="date-input"
            value={startDate}
            onChange={e => onStartDate(e.target.value)}
          />
        </div>
        <span className="date-separator">→</span>
        <div className="date-input-wrap">
          <span className="date-input-label">To</span>
          <input
            type="date"
            className="date-input"
            value={endDate}
            onChange={e => onEndDate(e.target.value)}
          />
        </div>
      </div>

      {/* Extra controls (e.g. status dropdown) */}
      {extra}

      {/* Active filter badge */}
      {(startDate || endDate) && (
        <div className="date-filter-active">
          📅 Filtered: {startDate || '…'} → {endDate || '…'}
        </div>
      )}
    </div>
  );
};

export default DateFilter;
