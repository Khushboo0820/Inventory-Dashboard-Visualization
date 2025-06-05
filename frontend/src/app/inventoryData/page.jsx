"use client";

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import Head from 'next/head';

import { fetchAllInventory } from '@/lib/api';

export default function InventoryList() {
  const [items, setItems] = useState([]);         // all loaded inventory rows
  const [page, setPage] = useState(1);            // current page
  const [limit] = useState(20);                   // you can expose this as a control
  const [hasMore, setHasMore] = useState(true);   // do we have more pages?
  const [loading, setLoading] = useState(false);  // are we currently fetching?
  const [error, setError] = useState(null);

  // A ref to the “load more” sentinel div
  const observerRef = useRef();


const loadPage = async (pageToLoad) => {
  setLoading(true);
  try {
    const res = await fetchAllInventory(pageToLoad, limit);
    const { data: payload } = res;

    // “payload.data” is an array of new rows. We want to merge with prev but remove duplicates:
    setItems((prev) => {
      // 1) Create a Map keyed by _id, starting with existing items
      const combined = new Map(prev.map(item => [item._id, item]));

      // 2) Insert (or overwrite) with each new row; duplicates by _id get overwritten
      for (const newRow of payload.data) {
        combined.set(newRow._id, newRow);
      }

      // 3) Return the array of unique values in insertion order
      return Array.from(combined.values());
    });

    setHasMore(payload.hasMore);
  } catch (err) {
    console.error('Error fetching inventory:', err);
    setError('Failed to load data');
  } finally {
    setLoading(false);
  }
};


  // On first mount, load page 1
  useEffect(() => {
    loadPage(1);
  }, []);

  // Whenever `page` changes (and is >1), load that page
  useEffect(() => {
    if (page === 1) return;
    loadPage(page);
  }, [page]);

  // IntersectionObserver callback: when sentinel is in view, load next page
  const handleObserver = useCallback((entries) => {
    const [entry] = entries;
    if (entry.isIntersecting && hasMore && !loading) {
      setPage((prev) => prev + 1);
    }
  }, [hasMore, loading]);

  // Set up the observer on the sentinel div
  useEffect(() => {
    const currentRef = observerRef.current;
    const options = { root: null, rootMargin: '0px', threshold: 1.0 };

    const observer = new IntersectionObserver(handleObserver, options);
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [handleObserver]);

  return (
    <>
      <Head>
        <title>All Inventory (Paginated / Infinite Scroll)</title>
      </Head>

      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-4">All Inventory Data</h1>

        <div className="overflow-x-auto border rounded shadow-sm">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                <th className="px-4 py-2 border">Date</th>
                <th className="px-4 py-2 border">Item ID</th>
                <th className="px-4 py-2 border">Item Name</th>
                <th className="px-4 py-2 border">Category</th>
                <th className="px-4 py-2 border">ABC Class</th>
                <th className="px-4 py-2 border">Opening Stock</th>
                <th className="px-4 py-2 border">Consumption</th>
                <th className="px-4 py-2 border">Incoming</th>
                <th className="px-4 py-2 border">Closing Stock</th>
                <th className="px-4 py-2 border">MSL</th>
                <th className="px-4 py-2 border">ITR</th>
                <th className="px-4 py-2 border">Ratio</th>
              </tr>
            </thead>
         <tbody>
  {items.map((row) => (
    <tr key={row._id} className="hover:bg-gray-50">
      {/* 1) Date */}
      <td className="px-4 py-2 border whitespace-nowrap">
        {row.date
          ? new Date(row.date).toLocaleDateString('en-GB')
          : '-'}
      </td>

      {/* 2) Item ID */}
      <td className="px-4 py-2 border whitespace-nowrap">
        {row.itemId ?? '-'}
      </td>

      {/* 3) Item Name (nested) */}
      <td className="px-4 py-2 border whitespace-nowrap">
        {row.itemInfo?.itemName ?? '-'}
      </td>

      {/* 4) Category (nested) */}
      <td className="px-4 py-2 border whitespace-nowrap">
        {row.itemInfo?.category ?? '-'}
      </td>

      {/* 5) ABC Class (nested) */}
      <td className="px-4 py-2 border whitespace-nowrap">
        {row.itemInfo?.abcClass ?? '-'}
      </td>

      {/* 6) Opening Stock */}
      <td className="px-4 py-2 border whitespace-nowrap">
        {row.openingStock != null ? row.openingStock : '-'}
      </td>

      {/* 7) Consumption */}
      <td className="px-4 py-2 border whitespace-nowrap">
        {row.consumption != null ? row.consumption : '-'}
      </td>

      {/* 8) Incoming */}
      <td className="px-4 py-2 border whitespace-nowrap">
        {row.incoming != null ? row.incoming : '-'}
      </td>

      {/* 9) Closing Stock */}
      <td className="px-4 py-2 border whitespace-nowrap">
        {row.closingStock != null ? row.closingStock : '-'}
      </td>

      {/* 10) MSL (nested) */}
      <td className="px-4 py-2 border whitespace-nowrap">
        {row.itemInfo?.msl != null ? row.itemInfo.msl : '-'}
      </td>

      {/* 11) Inventory Turnover Ratio */}
      <td className="px-4 py-2 border whitespace-nowrap">
        {row.inventoryTurnoverRatio != null
          ? row.inventoryTurnoverRatio.toFixed(2)
          : '-'}
      </td>

      {/* 12) Ratio */}
      <td className="px-4 py-2 border whitespace-nowrap">
        {row.ratio != null ? row.ratio.toFixed(2) : '-'}
      </td>
    </tr>
  ))}
</tbody>

          </table>
          { /* Sentinel element: when visible, load next page */ }
          <div ref={observerRef} className="h-8"></div>
        </div>

        {loading && (
          <p className="text-center mt-4 text-gray-600">Loading more…</p>
        )}
        {!hasMore && !loading && (
          <p className="text-center mt-4 text-gray-600">
            You’ve reached the end of the list.
          </p>
        )}
        {error && (
          <p className="text-center mt-4 text-red-600">{error}</p>
        )}
      </div>
    </>
  );
}
