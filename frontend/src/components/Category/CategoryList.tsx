import { useEffect, useState } from "react";
import axiosInstance from "../../services/apiClient";
import CategoryItem from "./CategoryItem";
import { useNavigate } from "react-router-dom";
import { Files, Loader, Plus } from "lucide-react";
// import Loader from "../Loader/Loader";

interface Category {
  _id: string;
  name: string;
  type: string;
}

function CategoryList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const getCategories = async () => {
    try {
      const res = await axiosInstance.get("/category");
      setCategories(res.data.category || []);
    } catch (error) {
      console.error("Category fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <div className="relative bg-white rounded-2xl p-5 shadow-md w-full mx-auto mt-20 md:mt-5">
      {/* FULL SCREEN OVERLAY + BLUR */}
      {loading && (
        <div className="fixed inset-0 backdrop-blur-md  bg-black/20 flex items-center justify-center z-9999">
          <Loader size={50} className="animate-spin text-black" />
        </div>
      )}

      {/* Content blur when loading */}
      <div className={loading ? "blur-sm pointer-events-none" : ""}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-gray-800">Categories</h2>

          {categories.length > 0 && (
            <button
              onClick={() => navigate("/add-category")}
              className="flex items-center gap-2 text-sm text-blue-600 border border-blue-600 
                px-3 py-1.5 rounded-lg hover:bg-blue-600 hover:text-white transition"
            >
              <Plus size={16} />
              Add Category
            </button>
          )}
        </div>

        {categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center gap-4">
            <div className="w-[700px] flex flex-col justify-center items-center text-gray-500 gap-3">
              <Files />
              <p className="text-sm sm:text-base">No categories found</p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/add-category")}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all text-sm sm:text-base"
            >
              + Add Category
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {categories.map((cat) => (
              <CategoryItem
                key={cat._id}
                id={cat._id}
                name={cat.name}
                type={cat.type}
                onDeleted={(deletedId) => {
                  setCategories((prev) =>
                    prev.filter((c) => c._id !== deletedId)
                  );
                }}
                onUpdated={() => getCategories()}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CategoryList;
