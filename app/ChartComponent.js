"use client";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";

export default function ChartComponent({ data, selectedHour }) {
  const hours = Object.keys(data.active_hours_distribution);
  const values = Object.values(data.active_hours_distribution);

  const chartData = {
    labels: hours,
    datasets: [
      {
        label: "Active Doctors Per Hour",
        data: values,
        backgroundColor: hours.map((h) => (h == selectedHour ? "rgba(255, 99, 132, 0.8)" : "rgba(54, 162, 235, 0.6)")),
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 10,
        },
      },
    },
  };

  return (
    <div className="w-full md:w-2/3 h-96 bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-center text-gray-800">Active Doctors for Hour {selectedHour}</h2>
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
}
