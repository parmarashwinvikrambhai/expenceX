import { useEffect, useState } from "react";
import { DollarSign, ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import StatCard from "./StatCard";
import axiosInstance from "../../../services/apiClient";

const SummaryCards = () => {
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await axiosInstance.get("/transaction");
        const data = res.data.transaction;

        let income = 0;
        let expense = 0;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data.forEach((t: { type: string; amount: any; }) => {
          if (t.type === "income") income += Number(t.amount);
          if (t.type === "expense") expense += Number(t.amount);
        });

        setTotalIncome(income);
        setTotalExpense(expense);
      } catch (error) {
        console.log("Summary fetch failed:", error);
      }
    };

    fetchSummary();
  }, []);

  const savings = totalIncome - totalExpense;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <StatCard
        title="Total Income"
        value={`$${totalIncome}`}
        icon={<ArrowDownCircle size={22} />}
        color="bg-green-500"
      />

      <StatCard
        title="Total Expense"
        value={`$${totalExpense}`}
        icon={<ArrowUpCircle size={22} />}
        color="bg-red-500"
      />

      <StatCard
        title="Savings"
        value={`$${savings}`}
        icon={<DollarSign size={22} />}
        color="bg-blue-500"
      />
    </div>
  );
};

export default SummaryCards;
