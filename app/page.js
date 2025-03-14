"use client"
import { useState, useEffect } from "react";
import ChartComponent from "./ChartComponent";

export default function Home() {
    const [stats, setStats] = useState(null);
    const [hour, setHour] = useState(8);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [downloading, setDownloading] = useState(false);

    const fetchStats = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch("https://intern-1-a4uq.onrender.com/stats");
            if (!response.ok) throw new Error("Failed to fetch stats");
            const data = await response.json();
            setStats(data);
        } catch (error) {
            setError(error.message);
        }
        setLoading(false);
    };

    const handleDownload = async () => {
        setDownloading(true);
        setError(null);
        try {
            const response = await fetch(`https://intern-1-a4uq.onrender.com/predict?hour=${hour}`);
            if (!response.ok) throw new Error("No doctors available at this time.");

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `predicted_doctors_hour_${hour}.csv`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            setError(error.message);
        }
        setDownloading(false);
    };

    useEffect(() => {
        fetchStats();
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
            <h1 className="text-2xl font-bold">Doctor Survey Prediction</h1>
            <button
                onClick={fetchStats}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
                Refresh Data
            </button>
            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">Error: {error}</p>}
            {stats && (
                <div className="mt-4 p-4 bg-white shadow rounded-lg">
                    <p className="font-semibold">Total Doctors: {stats.total_doctors}</p>
                    <p className="font-semibold">Avg. Usage Time: {stats.average_usage_time.toFixed(2)} min</p>
                    <p className="font-semibold">Survey Participation: {(stats.survey_participation_rate * 100).toFixed(2)}%</p>
                   
                </div>
            )}
            <div className="mt-6 p-4 bg-white shadow rounded-lg flex flex-col items-center">
                <label className="mb-2 font-semibold">Select Hour (0-23):</label>
                <input
                    type="range"
                    min="0"
                    max="23"
                    value={hour}
                    onChange={(e) => setHour(Number(e.target.value))}
                    className="w-full mb-2"
                />
                <p>Selected Hour: {hour}</p>
                <button
                    onClick={handleDownload}
                    disabled={downloading}
                    className="mt-3 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                >
                    {downloading ? "Downloading..." : "Download CSV"}
                </button>
            </div>
            {stats && stats.active_hours_distribution && <ChartComponent data={stats} selectedHour={hour} />}
        </div>
    );
}
