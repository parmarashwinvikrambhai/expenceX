import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import axiosInstance from "../../services/apiClient";
import {Listbox,ListboxButton,ListboxOption,ListboxOptions} from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import toast from "react-hot-toast";


const AddCategory = () => {
  const [showForm, setShowForm] = useState(true);
  const [type, setType] = useState("income");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleClose = () => {
    setShowForm(false);
    navigate("/category");
  };
  if (!showForm) return null;


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Please enter category name");
      return;
    }

    try {
      setLoading(true);

      await axiosInstance.post("/add-category", { name, type });
       toast.success("Category Added Successfully!", {
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
        navigate("/category");
      }, 500);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("failed to add category", {
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
    } 
  };


  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl p-8 w-[400px] shadow-xl relative">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold mb-4 text-gray-800 text-center">
          Add Category
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* TYPE DROPDOWN */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Type</label>

            <Listbox value={type} onChange={setType}>
              <div className="relative">
                <ListboxButton className="relative w-full rounded-lg border border-gray-400 px-3 py-2 text-left bg-white outline-none">
                  {type === "income" ? "Income" : "Expense"}
                  <ChevronDownIcon className="absolute top-2.5 right-2.5 size-4 text-gray-600" />
                </ListboxButton>

                <ListboxOptions className="absolute mt-1 w-full bg-white rounded-lg shadow-md p-1 z-50 border border-gray-500">
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

          {/* NAME FIELD */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-400 rounded-md px-3 py-2 mt-1 outline-none"
              placeholder="Enter category name"
              required
            />
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400"
          >
            {loading ? "Adding..." : "Add Category"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCategory;
