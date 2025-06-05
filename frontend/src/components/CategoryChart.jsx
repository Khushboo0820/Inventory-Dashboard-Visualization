import React from 'react';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export default function CategoryChart({ data, chartType = 'bar' }) {
  // data: [{ category, itemCount }, ...]
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE'];

  if (!data || !data.length) {
    return <p className="text-center py-8">No data to display.</p>;
  }

  return (
    <div className="w-full h-80">
      {chartType === 'bar' ? (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="itemCount" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        // Pie Chart fallback
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="itemCount"
              nameKey="category"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              label
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
