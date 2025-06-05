"use client";
import React, { useState } from 'react';

export default function FilterBar({ onApply }) {
  const [itemName, setItemName] = useState('');
  const [abcClass, setAbcClass] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onApply({ itemName, abcClass, startDate, endDate });
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
      <input
        type="text"
        placeholder="Item Name"
        value={itemName}
        onChange={(e) => setItemName(e.target.value)}
        className="p-2 border rounded"
      />
      <select
        value={abcClass}
        onChange={(e) => setAbcClass(e.target.value)}
        className="p-2 border rounded"
      >
        <option value="">All ABC Classes</option>
        <option value="A">A</option>
        <option value="B">B</option>
        <option value="C">C</option>
      </select>
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        className="p-2 border rounded"
      />
      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        className="p-2 border rounded"
      />
      <button type="submit" className="md:col-span-4 bg-blue-600 text-white p-2 rounded mt-2 md:mt-0">
        Apply Filters
      </button>
    </form>
  );
}
