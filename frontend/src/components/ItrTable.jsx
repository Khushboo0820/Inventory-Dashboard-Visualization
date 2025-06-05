"use client";

import React, {
  useMemo,
  useState,
} from 'react';

export default function ItrTable({ data }) {
  const [sortConfig, setSortConfig] = useState({ key: 'itr', direction: 'desc' });

  const sortedData = useMemo(() => {
    if (!data) return [];
    const sorted = [...data];
    sorted.sort((a, b) => {
      let valA = a[sortConfig.key];
      let valB = b[sortConfig.key];
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [data, sortConfig]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  if (!data || !data.length) {
    return <p className="text-center py-8">No data to display.</p>;
  }

  return (
    <table className="min-w-full bg-white">
      <thead>
        <tr>
          <th
            onClick={() => requestSort('itemId')}
            className="py-2 px-4 border cursor-pointer"
          >
            Item ID {sortConfig.key === 'itemId' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
          </th>
          <th
            onClick={() => requestSort('itemName')}
            className="py-2 px-4 border cursor-pointer"
          >
            Item Name {sortConfig.key === 'itemName' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
          </th>
          <th
            onClick={() => requestSort('totalConsumption')}
            className="py-2 px-4 border cursor-pointer"
          >
            Total Consumption {sortConfig.key === 'totalConsumption' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
          </th>
          <th
            onClick={() => requestSort('avgInventory')}
            className="py-2 px-4 border cursor-pointer"
          >
            Avg Inventory {sortConfig.key === 'avgInventory' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
          </th>
          <th
            onClick={() => requestSort('itr')}
            className="py-2 px-4 border cursor-pointer"
          >
            ITR {sortConfig.key === 'itr' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
          </th>
          <th className="py-2 px-4 border">Turnover Category</th>
        </tr>
      </thead>
      <tbody>
        {sortedData.map((row) => (
          <tr key={row.itemId} className="hover:bg-gray-50">
            <td className="py-2 px-4 border">{row.itemId}</td>
            <td className="py-2 px-4 border">{row.itemName}</td>
            <td className="py-2 px-4 border">{row.totalConsumption}</td>

            {/* Guard against null/undefined before calling toFixed */}
            <td className="py-2 px-4 border">
              {row.avgInventory != null ? row.avgInventory.toFixed(2) : '-'}
            </td>
            <td className="py-2 px-4 border">
              {row.itr != null ? row.itr.toFixed(2) : '-'}
            </td>

            <td className="py-2 px-4 border">
              <span
                className={`px-2 py-1 rounded text-white ${
                  row.turnoverCategory === 'lowTurnover'
                    ? 'bg-red-500'
                    : row.turnoverCategory === 'highTurnover'
                    ? 'bg-green-500'
                    : 'bg-gray-500'
                }`}
              >
                {row.turnoverCategory}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
