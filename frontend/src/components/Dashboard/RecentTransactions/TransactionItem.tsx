import { Trash2, UserRoundPen, X } from "lucide-react";
import moment from "moment";
import { useState, useEffect } from "react";
import axiosInstance from "../../../services/apiClient";
import toast from "react-hot-toast";

import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";

interface CategoryType {
  _id: string;
  name: string;
  type?: string;
}

interface TransactionProps {
  date: string;
  id: string;
  description: string;
  type: string;
  amount: number;
  category: { _id?: string; name: string };
  categories?: CategoryType[]; // <-- ADD THIS
  onDeleted?: (id: string) => void;
  onUpdated?: () => void;
}


const TransactionItem = ({
  id,
  date,
  description,
  type,
  amount,
  category,
  onDeleted,
  onUpdated,
}: TransactionProps) => {
  const isIncome = type === "income";

  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [editDescription, setEditDescription] = useState(description);
  const [editAmount, setEditAmount] = useState(amount);
  const [editType, setEditType] = useState(type);
  const [editDate, setEditDate] = useState(moment(date).format("YYYY-MM-DD"));
  const [editCategory, setEditCategory] = useState<CategoryType | null>(null);

  const [loading, setLoading] = useState(false);

  // category list
  const [categoryList, setCategoryList] = useState<CategoryType[]>([]);
  const filteredCategories = categoryList.filter(
    (cat) => cat.type === editType
  );

 useEffect(() => {
   if (!showEditModal) return;

   const fetchCategory = async () => {
     try {
       const response = await axiosInstance.get("/category");
       const cats = response.data.category || [];
       setCategoryList(cats);

       const matched = cats.find((c: CategoryType) => c._id === category._id);
       if (matched) setEditCategory(matched);
     } catch (error) {
       console.error("Category fetch error:", error);
     }
   };

   fetchCategory();
 }, [showEditModal, category._id]);


  // DELETE
  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/delete-transaction/${id}`);
      setShowModal(false);

     toast.success("transaction Deleted Successfully!", {
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

      onDeleted?.(id);
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  // UPDATE
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editCategory) {
      toast.error("Please select category", {
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
      return;
    }

    try {
      setLoading(true);

      await axiosInstance.put(`/update-transaction/${id}`, {
        description: editDescription,
        amount: editAmount,
        type: editType,
        date: editDate,
        category: editCategory._id,
      });

      toast.success("Transaction Updated Successfully!", {
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

      setShowEditModal(false);
      onUpdated?.();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Faliled to update", {
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

  return (
    <>
      {/* ITEM */}
      <div
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between 
                 bg-gray-50 hover:bg-gray-100 px-4 py-3 rounded-xl transition gap-3"
      >
        <div className="capitalize w-full">
          <p className="text-gray-900 font-medium text-base sm:text-lg">
            {category.name}
          </p>

          <p className="text-xs sm:text-sm text-gray-500 flex flex-wrap gap-3 sm:gap-6 mt-1">
            <span>{type}</span>
            <span>{moment(date).format("MM/DD/YYYY")}</span>
            <span className="break-all">{description}</span>
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 self-end sm:self-auto">
          <p
            className={`text-sm sm:text-base font-semibold ${
              isIncome ? "text-green-600" : "text-red-500"
            }`}
          >
            {isIncome ? `+$${amount}` : `-$${Math.abs(amount)}`}
          </p>

          <button
            onClick={() => setShowEditModal(true)}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-gray-400 
                     flex items-center justify-center hover:bg-gray-200 transition"
          >
            <UserRoundPen size={18} className="text-blue-500" />
          </button>

          <button
            onClick={() => setShowModal(true)}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-gray-400 
                     flex items-center justify-center hover:bg-gray-200 transition"
          >
            <Trash2 size={18} className="text-red-500" />
          </button>
        </div>
      </div>

      {/* DELETE MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-4">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-xs sm:max-w-sm">
            <h3 className="text-lg font-semibold mb-4">Delete Transaction?</h3>

            <p className="mb-6 text-sm sm:text-base">
              Are you sure you want to delete{" "}
              <span className="font-bold capitalize">{category.name}</span>?
            </p>

            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex justify-center items-center px-4 z-50">
          <div className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-sm sm:max-w-md shadow-xl relative">
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>

            <h2 className="text-lg sm:text-xl font-semibold mb-6 text-center">
              Edit Transaction
            </h2>

            <form className="space-y-4" onSubmit={handleUpdate}>
              {/* TYPE */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Type
                </label>
                <Listbox value={editType} onChange={setEditType}>
                  <div className="relative">
                    <ListboxButton className="relative w-full rounded-lg border border-gray-400 px-3 py-2 text-left bg-white">
                      {editType === "income" ? "Income" : "Expense"}
                      <ChevronDownIcon className="absolute top-2.5 right-2.5 size-4 text-gray-600" />
                    </ListboxButton>

                    <ListboxOptions className="absolute mt-1 w-full bg-white rounded-lg shadow-md p-1 z-50 border border-gray-400">
                      <ListboxOption
                        value="income"
                        className="cursor-pointer px-3 py-2 rounded-lg data-focus:bg-gray-200"
                      >
                        Income
                      </ListboxOption>
                      <ListboxOption
                        value="expense"
                        className="cursor-pointer px-3 py-2 rounded-lg data-focus:bg-gray-200"
                      >
                        Expense
                      </ListboxOption>
                    </ListboxOptions>
                  </div>
                </Listbox>
              </div>

              {/* CATEGORY */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Category
                </label>

                <Listbox value={editCategory} onChange={setEditCategory}>
                  <div className="relative">
                    <ListboxButton className="relative w-full rounded-lg border border-gray-400 px-3 py-2 text-left bg-white">
                      {editCategory ? editCategory.name : "Select category"}
                      <ChevronDownIcon className="absolute top-2.5 right-2.5 size-4 text-gray-600" />
                    </ListboxButton>

                    <ListboxOptions className="absolute mt-1 w-full bg-white rounded-lg shadow-md p-1 z-50 border border-gray-400">
                      {filteredCategories.length > 0 ? (
                        filteredCategories.map((cat) => (
                          <ListboxOption
                            key={cat._id}
                            value={cat}
                            className="cursor-pointer px-3 py-2 rounded-lg flex items-center gap-2 data-focus:bg-gray-200"
                          >
                            <CheckIcon
                              className={clsx(
                                "size-4",
                                editCategory?._id === cat._id
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
                <label className="text-gray-700 font-medium">Amount</label>
                <input
                  type="number"
                  value={editAmount}
                  onChange={(e) => setEditAmount(Number(e.target.value))}
                  className="w-full border border-gray-400 rounded-lg px-3 py-2 outline-none"
                />
              </div>

              {/* DATE */}
              <div>
                <label className="text-gray-700 font-medium">Date</label>
                <input
                  type="date"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  className="w-full border border-gray-400 rounded-lg px-3 py-2 outline-none"
                />
              </div>

              {/* DESCRIPTION */}
              <div>
                <label className="text-gray-700 font-medium">Description</label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full border border-gray-400 rounded-lg px-3 py-2 outline-none"
                />
              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400"
              >
                {loading ? "Updating..." : "Update Transaction"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );

};

export default TransactionItem;
