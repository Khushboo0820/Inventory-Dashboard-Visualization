"use client";
import React, { useState } from 'react';

import Head from 'next/head';

import StockMslChart from '@/components/StockMslChart';
import { fetchStockVsMsl } from '@/lib/api';

export default function Q2StockMsl() {
  const [itemId, setItemId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    if (!itemId) return; // require itemId
    setLoading(true);
    try {
      const response = await fetchStockVsMsl({ itemId, startDate, endDate });
      setData(response.data);
    } catch (err) {
      console.error(err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    loadData();
  };

  return (
    <>
      <Head>
        <title>Q2: Stock vs. MSL Trends</title>
      </Head>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Trend: Closing Stock vs Minimum Stock Level</h1>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <input
            type="text"
            value={itemId}
            placeholder="Enter Item ID"
            onChange={(e) => setItemId(e.target.value)}
            className="p-2 border rounded"
            required
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
          <button type="submit" className="bg-blue-600 text-white p-2 rounded">
            Load Trend
          </button>
        </form>
        {loading ? (
          <p className="text-center py-8">Loading...</p>
        ) : (
          <StockMslChart data={data} />
        )}
      </div>
    </>
  );
}
