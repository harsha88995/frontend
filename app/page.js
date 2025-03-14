"use client";
import { useEffect, useState } from "react";
import ChartComponent from "./ChartComponent";

export default function Home() {
  const [stats, setStats] = useState(null);
  const [hour, setHour] = useState(8);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);

  // Fetch doctor statistics including model accuracy
  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:8000/stats");
      if (!response.ok) throw new Error("Failed to fetch stats");
      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  // Download predicted doctors CSV
  const handleDownload = async () => {
    setDownloading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:8000/predict?hour=${hour}`);
      if (!response.ok) throw new Error("No doctors available at this time.");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `predicted_doctors_hour_${hour}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message);
    }
    setDownloading(false);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-300 to-indigo-500 p-6 text-white">
      <h1 className="text-4xl font-bold mb-6">Doctor Survey Insights</h1>

      {/* Statistics Section */}
      {stats && (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6 w-full md:w-1/2 flex flex-col items-center text-black">
          <p className="text-lg font-semibold">Total Doctors: {stats.total_doctors}</p>
          <p className="text-lg font-semibold">Avg. Usage Time: {stats.average_usage_time.toFixed(2)} min</p>
          <p className="text-lg font-semibold">Survey Participation: {(stats.survey_participation_rate * 100).toFixed(2)}%</p>
          <p className="text-lg font-semibold text-green-600">Model Accuracy: {(stats.model_accuracy * 100).toFixed(2)}%</p>
        </div>
      )}

      {/* Input & Download Section */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-6 w-full md:w-1/2 flex flex-col items-center text-black">
        <label className="mb-2 text-lg font-semibold">Select Hour (0-23):</label>
        <input
          type="range"
          min="0"
          max="23"
          value={hour}
          onChange={(e) => setHour(Number(e.target.value))}
          className="w-full mb-4"
        />
        <p className="text-lg font-medium">Selected Hour: {hour}</p>
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="px-5 py-2 mt-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
        >
          {downloading ? "Downloading..." : "Download CSV"}
        </button>
      </div>

      {/* Chart Section */}
      {loading && <p className="text-lg">Loading data...</p>}
      {error && <p className="text-red-300">Error: {error}</p>}
      {stats && <ChartComponent data={stats} selectedHour={hour} />}
    </div>
  );
}
