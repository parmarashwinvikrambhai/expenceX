import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { useEffect, useState } from "react";
import axiosInstance from "../../../services/apiClient";

interface ChartItem {
  name: string;
  value: number;
  [key: string]: string | number; 
}

const COLORS = ["#10B981", "#EF4444", "#3B82F6"]; 

const SpendingBreakdown = () => {
  const [chartData, setChartData] = useState<ChartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get("/auth/profile");

        const { totalIncome, totalExpense, saving } = res.data;

        const formatted: ChartItem[] = [
          { name: "Income", value: totalIncome },
          { name: "Expense", value: totalExpense },
          { name: "Saving", value: saving },
        ];

        setChartData(formatted);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-md text-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <h2 className="text-lg font-semibold mb-4 text-gray-700">
        Financial Overview
      </h2>

      <div className="w-full h-64">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              dataKey="value"
              label={({ name, percent = 0 }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
            >
              {chartData.map((_entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>

            <Tooltip />
            <Legend verticalAlign="bottom" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SpendingBreakdown;
