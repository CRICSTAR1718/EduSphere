import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

function BarChart({ labels = [], dataValues = [], title }) {

    const data = {
        labels,
        datasets: [
            {
                label: title,
                data: dataValues,
                backgroundColor: "#6366f1",
                borderRadius: 8,
                barThickness: 40,
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,   
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: "#1e293b",
                titleColor: "#ffffff",
                bodyColor: "#ffffff",
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: "#e5e7eb",
                },
            },
            x: {
                grid: {
                    display: false,
                },
            },
        },
    };

    return (
        <div className="w-full max-w-3xl mx-auto h-64 sm:h-80">
            <Bar data={data} options={options} />
        </div>
    );
}

export default BarChart;