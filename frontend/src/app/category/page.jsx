"use client";
import React, {
  useEffect,
  useState,
} from 'react';

import Head from 'next/head';

import CategoryChart from '@/components/CategoryChart';
import FilterBar from '@/components/FilterBar';
import { fetchCategoryDistribution } from '@/lib/api';

export default function Q1Category() {
  const [filters, setFilters] = useState({});
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadData = async (appliedFilters) => {
    setLoading(true);
    try {
      const response = await fetchCategoryDistribution(appliedFilters);
      setChartData(response.data);
    } catch (err) {
      console.error(err);
      setChartData([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial load without filters
  useEffect(() => {
    loadData({});
  }, []);

  const handleApply = (newFilters) => {
    setFilters(newFilters);
    loadData(newFilters);
  };

  return (
    <>
      <Head>
        <title>Q1: Category‐Wise Distribution</title>
      </Head>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Category‐Wise Distribution of Items</h1>
        <FilterBar onApply={handleApply} />
        {loading ? (
          <p className="text-center py-8">Loading...</p>
        ) : (
          <CategoryChart data={chartData} chartType="bar" />
        )}
      </div>
    </>
  );
}
