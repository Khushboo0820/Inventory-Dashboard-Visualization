// frontend/components/ConsumptionChart.js
import React from 'react';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export default function ConsumptionChart({ data, chartType = 'line' }) {
  // data: [{ yearMonth, totalConsumption }, ...]
  if (!data || !data.length) {
    return <p className="text-center py-8">No data to display.</p>;
  }

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        {chartType === 'line' ? (
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="yearMonth" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="totalConsumption" stroke="#8884d8" />
          </LineChart>
        ) : (
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="yearMonth" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="totalConsumption" fill="#82ca9d" />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
