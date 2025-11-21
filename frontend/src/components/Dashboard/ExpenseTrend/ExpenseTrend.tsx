import { useEffect, useState } from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axiosInstance from "../../../services/apiClient";

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const ExpenseTrend = () => {
  const [chartData, setChartData] = useState<{ month: string; expense: number }[]>([]);


  useEffect(() => {
    fetchMonthlyExpenses();
  }, []);

  const fetchMonthlyExpenses = async () => {
    try {
      const res = await axiosInstance.get("/transaction");
      const transactions = res.data.transaction || [];

      
      const monthlyTotals: Record<string, number> = {};

      months.forEach((m) => {
        monthlyTotals[m] = 0;
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      transactions.forEach((t: any) => {
        if (t.type === "expense") {
          const date = new Date(t.date);
          const monthIndex = date.getMonth();
          const monthName = months[monthIndex];

          monthlyTotals[monthName] += Number(t.amount);
        }
      });


      const formattedData = months.map((m) => ({
        month: m,
        expense: monthlyTotals[m],
      }));

      setChartData(formattedData);
    } catch (error) {
      console.log("Chart fetch error:", error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <h2 className="text-lg font-semibold mb-4 text-gray-700">
        Monthly Expense Trend
      </h2>

      <div className="w-full h-64">
        <ResponsiveContainer>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="month" stroke="#6B7280" />
            <YAxis stroke="#6B7280" />
            <Tooltip
              contentStyle={{ borderRadius: "10px", borderColor: "#ddd" }}
            />
            <Line
              type="monotone"
              dataKey="expense"
              stroke="#3B82F6"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ExpenseTrend;
 