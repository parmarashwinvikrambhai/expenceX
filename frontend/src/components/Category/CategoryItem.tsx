import { Loader, Trash2, UserRoundPen, X } from "lucide-react";
import { useState } from "react";
import axiosInstance from "../../services/apiClient";
import toast from "react-hot-toast";

interface Props {
  id: string;
  name: string;
  type: string;
  onDeleted?: (id: string) => void;
  onUpdated?: () => void;
}

function CategoryItem({ id, name, type, onDeleted, onUpdated }: Props) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // UPDATE STATES
  const [editName, setEditName] = useState(name);
  const [editType, setEditType] = useState(type);
  const [loading, setLoading] = useState(false);

  const openEditModal = () => {
    setEditName(name);
    setEditType(type);
    setShowEditModal(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editName.trim()) {
      toast.error("Please enter category", {
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

      await axiosInstance.put(`/update-category/${id}`, {
        name: editName,
        type: editType,
      });

    toast.success("Category Updated Successfully!", {
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
      toast.error("failed to update category", {
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

  const handleDelete = async () => {
    try {
      setLoading(true);

      await axiosInstance.delete(`/delete-category/${id}`);
      toast.success("Category Deleted Successfully!", {
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

      setShowDeleteModal(false);
      onDeleted?.(id);
    } catch (error) {
      toast.error("failed to Delete category", {
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

      console.error("Delete error:", error);
    } finally {
      setLoading(false);
    }
  };

 return (
   <>
     {/* MAIN CATEGORY ITEM */}
     <div
       className="flex flex-col sm:flex-row sm:items-center sm:justify-between 
                 bg-white hover:bg-gray-100 transition-colors px-4 py-3 rounded-xl gap-3"
     >
       {loading && (
         <div className="fixed inset-0 backdrop-blur-md  bg-black/20 flex items-center justify-center z-9999">
           <Loader size={50} className="animate-spin text-black" />
         </div>
       )}
       {/* LEFT TEXT */}
       <div className="capitalize flex flex-col gap-1 w-full">
         <p className="text-gray-900 font-medium text-base sm:text-lg">
           {name}
         </p>
         <p className="text-sm text-gray-500">{type}</p>
       </div>

       {/* ACTION BUTTONS */}
       <div className="flex gap-3 sm:gap-4 self-end sm:self-auto">
         {/* EDIT BUTTON */}
         <button
           type="button"
           className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-gray-400 
                     flex items-center justify-center hover:bg-gray-200 transition"
           onClick={openEditModal}
         >
           <UserRoundPen size={18} className="text-blue-500" />
         </button>

         {/* DELETE BUTTON */}
         <button
           type="button"
           className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-gray-400 
                     flex items-center justify-center hover:bg-gray-200 transition"
           onClick={() => setShowDeleteModal(true)}
         >
           <Trash2 size={18} className="text-red-500" />
         </button>
       </div>
     </div>

     {/* ===================== DELETE MODAL ===================== */}
     {showDeleteModal && (
       <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-4">
         <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-xs sm:max-w-sm">
           <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
             Delete Category?
           </h3>

           <p className="text-gray-600 mb-6 text-sm sm:text-base">
             Are you sure you want to delete{" "}
             <span className="font-bold capitalize">{name}</span>?
           </p>

           <div className="flex justify-end gap-3">
             <button
               className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400"
               onClick={() => setShowDeleteModal(false)}
             >
               Cancel
             </button>

             <button
               className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600"
               onClick={handleDelete}
             >
               Delete
             </button>
           </div>
         </div>
       </div>
     )}

     {/* ===================== EDIT MODAL ===================== */}
     {showEditModal && (
       <div
         className="fixed inset-0 bg-black/40 backdrop-blur-md 
                      flex justify-center items-center px-4 z-50"
       >
         <div className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-sm sm:max-w-md shadow-xl relative">
           {/* Close Button */}
           <button
             onClick={() => setShowEditModal(false)}
             className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
           >
             <X size={20} />
           </button>

           <h2 className="text-lg sm:text-xl font-semibold mb-6 text-gray-800 text-center">
             Edit Category
           </h2>

           <form className="space-y-4" onSubmit={handleUpdate}>
             {/* TYPE DROPDOWN */}
             <div className="flex flex-col gap-2">
               <label className="text-[15px] font-medium text-gray-700">
                 Select Type
               </label>

               <select
                 value={editType}
                 onChange={(e) => setEditType(e.target.value)}
                 className="border border-gray-400 rounded-lg px-3 py-2 bg-white outline-none"
               >
                 <option value="income">Income</option>
                 <option value="expense">Expense</option>
               </select>
             </div>

             {/* NAME FIELD */}
             <div>
               <label className="block text-[15px] font-medium text-gray-700">
                 Category Name
               </label>
               <input
                 type="text"
                 value={editName}
                 onChange={(e) => setEditName(e.target.value)}
                 className="w-full border border-gray-400 rounded-lg px-3 py-2 mt-1 outline-none"
                 placeholder="Enter category name"
                 required
               />
             </div>

             {/* UPDATE BUTTON */}
             <button
               type="submit"
               disabled={loading}
               className="w-full bg-indigo-600 text-white py-2 rounded-lg 
                         hover:bg-indigo-700 disabled:bg-gray-400"
             >
               {loading ? "Updating..." : "Update Category"}
             </button>
           </form>
         </div>
       </div>
     )}
   </>
 );

}

export default CategoryItem;
