"use client";

import { useState, useEffect } from "react";
import { getFilteredPageViews } from "@/lib/analytics-actions";
import { Search, Calendar, Filter, Loader2 } from "lucide-react";
import { clsx } from "clsx";

export default function AnalyticsFilterTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    pagePath: ""
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getFilteredPageViews(filters);
      setData(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleApplyFilters = (e) => {
    e.preventDefault();
    fetchData();
  };

  const clearFilters = () => {
    const emptyFilters = { startDate: "", endDate: "", pagePath: "" };
    setFilters(emptyFilters);
    // fetchData will be called manually or we can call it here but we'll wait for user
  };

  return (
    <div className="rounded-2xl bg-[#0a0a0a] border border-gray-800 overflow-hidden shadow-xl mt-8">
      {/* Header */}
      <div className="p-6 border-b border-gray-800 bg-gray-900/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
            <Filter className="w-4 h-4 text-blue-400" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-wide uppercase italic">Custom Page Views Log</h2>
        </div>

        {/* Filter Form */}
        <form onSubmit={handleApplyFilters} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex items-center gap-2 bg-gray-900 border border-gray-800 px-3 py-1.5 rounded-lg focus-within:border-blue-500 transition-colors">
            <Search className="w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Filter by Page Path..."
              className="bg-transparent text-sm text-white focus:outline-none w-32 sm:w-40"
              value={filters.pagePath}
              onChange={(e) => setFilters((prev) => ({ ...prev, pagePath: e.target.value }))}
            />
          </div>
          <div className="flex items-center gap-2 bg-gray-900 border border-gray-800 px-3 py-1.5 rounded-lg focus-within:border-blue-500 transition-colors">
            <Calendar className="w-4 h-4 text-gray-500" />
            <input
              type="date"
              className="bg-transparent text-sm text-white focus:outline-none placeholder-gray-500"
              value={filters.startDate}
              onChange={(e) => setFilters((prev) => ({ ...prev, startDate: e.target.value }))}
            />
            <span className="text-gray-500 text-sm">-</span>
            <input
              type="date"
              className="bg-transparent text-sm text-white focus:outline-none placeholder-gray-500"
              value={filters.endDate}
              onChange={(e) => setFilters((prev) => ({ ...prev, endDate: e.target.value }))}
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Apply"}
            </button>
            <button
              type="button"
              onClick={clearFilters}
              className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              Clear
            </button>
          </div>
        </form>
      </div>

      {/* Table Data */}
      <div className="p-0 overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-gray-900 text-gray-400 text-xs tracking-wider uppercase border-b border-gray-800">
              <th className="p-4 font-semibold">Page Path</th>
              <th className="p-4 font-semibold text-right">Unique Visitors</th>
              <th className="p-4 font-semibold text-right">Total Views</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/50 text-sm text-gray-300 relative">
            {loading ? (
              <tr>
                <td colSpan="3" className="p-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-2" />
                    <span className="text-gray-500">Loading data...</span>
                  </div>
                </td>
              </tr>
            ) : data.length > 0 ? (
              data.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-800/30 transition-colors">
                  <td className="p-4 font-medium font-mono text-xs">{item.page_path}</td>
                  <td className="p-4 text-right">{item.unique_visitors.toLocaleString()}</td>
                  <td className="p-4 text-right font-bold text-white">{item.views.toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="p-12 text-center text-gray-500">
                  No data found for these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
