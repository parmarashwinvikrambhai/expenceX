import { useEffect, useState } from "react";
import TransactionItem from "./TransactionItem";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../services/apiClient";
import { Plus } from "lucide-react";

interface CategoryType {
  _id: string;
  name: string;
}


interface Transaction {
  _id: string;
  date: string;
  description: string;
  type: string;
  amount: number;
  category: CategoryType;
}

const RecentTransactions = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    try {
      const res = await axiosInstance.get("/transaction");
      setTransactions(res.data.transaction || res.data);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axiosInstance.get("/category");

      const data = res.data.category || res.data;
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      setCategories([]); // fallback safe
    }
  };


  useEffect(() => {
    fetchTransactions();
    fetchCategories();
  }, []);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md mt-16 sm:mt-10 md:mt-8 max-w-full w-full sm:p-6 md:p-8 lg:p-10">
      <div
        className="flex items-center justify-between mb-5 
                    flex-wrap gap-3"
      >
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
          Recent Transactions
        </h2>

        {transactions.length > 0 && (
          <button
            className="flex items-center gap-1 text-sm sm:text-base 
                     text-blue-600 hover:bg-blue-700 hover:text-white 
                     transition-colors border p-2 rounded-lg cursor-pointer"
            onClick={() => navigate("/add-transaction")}
          >
            <Plus size={16} />
            Add Transaction
          </button>
        )}
      </div>

      {loading ? (
        <p className="text-gray-500 text-center py-8 text-sm sm:text-base">
          Loading...
        </p>
      ) : transactions.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center 
                      py-10 text-center gap-4"
        >
          <p className="text-gray-500 text-sm sm:text-base">
            No transactions found
          </p>
          <button
            type="button"
            onClick={() => navigate("/add-transaction")}
            className="bg-indigo-600 text-white px-4 py-2 
                     rounded-lg hover:bg-indigo-700 transition-all 
                     text-sm sm:text-base"
          >
            + Add Transaction
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.map((t) => (
            <TransactionItem
              key={t._id}
              date={t.date}
              id={t._id}
              description={t.description}
              type={t.type}
              amount={t.amount}
              category={t.category}
              categories={categories}
              onDeleted={(deletedId) => {
                setTransactions((prev) =>
                  prev.filter((c) => c._id !== deletedId)
                );
              }}
              onUpdated={fetchTransactions}
            />
          ))}
        </div>
      )}
    </div>
  );

};

export default RecentTransactions;
