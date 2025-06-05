// pages/index.js

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-8">Inventory Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
        {/* Q1: Category-wise Distribution */}
        <Link href="/category">
          <div className="block bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition">
            <h2 className="text-xl font-semibold mb-2">Q1: Category Distribution</h2>
            <p className="text-gray-600">
              See how many distinct items exist in each category. Filter by item name, ABC class, or date range.
            </p>
          </div>
        </Link>

        {/* Q2: Stock vs. MSL Trends */}
        <Link href="/stock-msl">
          <div className="block bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition">
            <h2 className="text-xl font-semibold mb-2">Q2: Stock vs. MSL Trends</h2>
            <p className="text-gray-600">
              View a time series of closing stock vs. minimum stock level (MSL). Highlight where stock is below or well above MSL.
            </p>
          </div>
        </Link>

        {/* Q3: Monthly Consumption Trends */}
        <Link href="/consumption">
          <div className="block bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition">
            <h2 className="text-xl font-semibold mb-2">Q3: Consumption Trends</h2>
            <p className="text-gray-600">
              Track month‐by‐month total consumption. Filter by category, ABC class, item ID, or date range.
            </p>
          </div>
        </Link>

        {/* Q4: Inventory Turnover Ratios */}
        <Link href="/itr">
          <div className="block bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition">
            <h2 className="text-xl font-semibold mb-2">Q4: Inventory Turnover Ratios (ITR)</h2>
            <p className="text-gray-600">
              Calculate ITR for each item (total consumption ÷ average inventory). See which items have low or high turnover.
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
