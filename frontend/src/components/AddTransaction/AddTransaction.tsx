import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import axiosInstance from "../../services/apiClient";

import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import toast from "react-hot-toast";


interface Category {
  _id: string;
  name: string;
  type: string;
}

const AddTransaction = () => {
  const [showForm, setShowForm] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState<Category | null>(null);
  const [amount, setAmount] = useState<number | "">("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);


  const navigate = useNavigate();

  const handleClose = () => {
    setShowForm(false);
    navigate("/transactions");
  };

  const fetchCategory = async () => {
    try {
      const response = await axiosInstance.get("/category");
      setCategories(response.data.category || response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  const filteredCategories = categories.filter((cat) => cat.type === type);

 const handleSubmit = async (e: React.FormEvent) => {
   e.preventDefault();
    setLoading(true);
   try {
     await axiosInstance.post("/create-transaction", {
       type,
       category: category?._id,
       amount: Number(amount),
       date,
       description,
     });

     toast.success("Trasaction Added Successfully!", {
       style: {
         borderRadius: "8px",
         background: "#1e40af",
         color: "#fff",
         fontWeight: 600,
         padding: "12px 16px",
         boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
       },
       iconTheme: {
         primary: "#fff",
         secondary: "#1e40af",
       },
     });

     setTimeout(() => {
       navigate("/transactions");
     }, 800);
     // eslint-disable-next-line @typescript-eslint/no-unused-vars
   } catch (err) {
     toast.error("Failed to add Transaction", {
       style: {
         borderRadius: "8px",
         background: "#dc2626",
         color: "#fff",
         fontWeight: 600,
         padding: "12px 16px",
         boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
       },
       iconTheme: {
         primary: "#fff",
         secondary: "#dc2626",
       },
     });
   } finally {
     setLoading(false);
   }
 };
if (!showForm) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl p-8 w-[400px] shadow-xl relative">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 mt-3">
            Add Transaction
          </h2>
          <button
            onClick={handleClose}
            className=" text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* TYPE DROPDOWN */}
          <div className="flex flex-col gap-2">
            <label className="block text-sm font-medium text-gray-700">
              Type
            </label>

            <Listbox value={type} onChange={setType}>
              <div className="relative">
                <ListboxButton className="relative w-full rounded-lg border border-gray-400 px-3 py-2 text-left bg-white outline-none">
                  {type === "income" ? "Income" : "Expense"}
                  <ChevronDownIcon className="absolute top-2.5 right-2.5 size-4 text-gray-600" />
                </ListboxButton>

                <ListboxOptions className="absolute mt-1 w-full bg-white rounded-lg shadow-md p-1 z-50 outline-none appearance-none border border-gray-500">
                  <ListboxOption
                    value="income"
                    className="cursor-pointer px-3 py-2 rounded-lg data-focus:bg-gray-300 outline-none"
                  >
                    Income
                  </ListboxOption>

                  <ListboxOption
                    value="expense"
                    className="cursor-pointer px-3 py-2 rounded-lg data-focus:bg-gray-300 outline-none"
                  >
                    Expense
                  </ListboxOption>
                </ListboxOptions>
              </div>
            </Listbox>
          </div>

          {/* CATEGORY DROPDOWN */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Category
            </label>

            <Listbox value={category} onChange={setCategory}>
              <div className="relative">
                <ListboxButton className="relative w-full rounded-lg border border-gray-400 px-3 py-2 text-left bg-white outline-none">
                  {category ? category.name : "Select category"}
                  <ChevronDownIcon className="absolute top-2.5 right-2.5 size-4 text-gray-600" />
                </ListboxButton>

                <ListboxOptions className="absolute mt-1 w-full bg-white rounded-lg shadow-md p-1 z-50 outline-none appearance-none border border-gray-500">
                  {filteredCategories.length > 0 ? (
                    filteredCategories.map((cat) => (
                      <ListboxOption
                        key={cat._id}
                        value={cat}
                        className="cursor-pointer px-3 py-2 rounded-lg data-focus:bg-gray-300 flex items-center gap-2"
                      >
                        <CheckIcon
                          className={clsx(
                            "size-4",
                            category?._id === cat._id
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {cat.name}
                      </ListboxOption>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-gray-500 text-sm">
                      No categories found
                    </div>
                  )}
                </ListboxOptions>
              </div>
            </Listbox>
          </div>

          {/* AMOUNT */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Amount
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full border border-gray-400 rounded-md px-3 py-2 mt-1 outline-none"
              required
            />
          </div>

          {/* DATE */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-gray-400 rounded-md px-3 outline-none py-2 mt-1"
              required
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-400 rounded-md px-3 py-2 mt-1 outline-none"
              placeholder="Add note..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400">
            {loading ? "Adding..." : "Transaction"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTransaction;
