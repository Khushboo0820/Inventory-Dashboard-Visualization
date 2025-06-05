"use client";
import React, {
  useEffect,
  useState,
} from 'react';

import Head from 'next/head';

import ConsumptionChart from '@/components/ConsumptionCharts';
import { fetchMonthlyConsumption } from '@/lib/api';

export default function Q3Consumption() {
  const [category, setCategory] = useState('');
  const [abcClass, setAbcClass] = useState('');
  const [itemId, setItemId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await fetchMonthlyConsumption({ category, abcClass, itemId, startDate, endDate });
      setData(response.data);
    } catch (err) {
      console.error(err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(); // initial load
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    loadData();
  };

  return (
    <>
      <Head>
        <title>Q3: Consumption Trends</title>
      </Head>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Monthly Consumption Trends</h1>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Consumables">Consumables</option>
            {/* Add other categories or fetch dynamically from ItemMaster */}
          </select>
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
            type="text"
            value={itemId}
            placeholder="Item ID"
            onChange={(e) => setItemId(e.target.value)}
            className="p-2 border rounded"
          />
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
          <button type="submit" className="md:col-span-5 bg-blue-600 text-white p-2 rounded mt-2 md:mt-0">
            Apply Filters
          </button>
        </form>

        {loading ? (
          <p className="text-center py-8">Loading...</p>
        ) : (
          <ConsumptionChart data={data} chartType="line" />
        )}
      </div>
    </>
  );
}
