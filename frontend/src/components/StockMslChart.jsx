import React from 'react';

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export default function StockMslChart({ data }) {
  // data: [{ date, closingStock, msl, status }, ...]
  if (!data || !data.length) {
    return <p className="text-center py-8">No data to display.</p>;
  }

  // Convert date string → readable format on xAxis
  const formattedData = data.map((d) => ({
    ...d,
    // e.g. "Jan 05" (adjust as needed)
    displayDate: new Date(d.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
  }));

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={formattedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="displayDate" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          {/* Closing Stock line */}
          <Line
            type="monotone"
            dataKey="closingStock"
            stroke="#8884d8"
            dot={({ payload }) => {
              if (payload.status === 'belowMSL') {
                return <circle cx={0} cy={0} r={4} fill="red" />;
              } else if (payload.status === 'aboveMSL') {
                return <circle cx={0} cy={0} r={4} fill="green" />;
              }
              return <circle cx={0} cy={0} r={3} fill="#8884d8" />;
            }}
          />
          {/* MSL line */}
          <Line type="monotone" dataKey="msl" stroke="#FFBB28" dot={false} />
          {/* Optionally, easiest: add a ReferenceLine at MSL to show threshold */}
          {/* <ReferenceLine y={someValue} label="MSL" stroke="orange" /> */}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
