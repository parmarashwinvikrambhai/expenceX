import { useEffect, useState } from "react";
import axiosInstance from "../../services/apiClient";
import CategoryItem from "./CategoryItem";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

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
      setCategories(res.data.category);
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
    <div className="bg-white rounded-2xl p-5 shadow-md w-full mx-auto mt-20 md:mt-5">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-gray-800">Categories</h2>

        <button
          onClick={() => navigate("/add-category")}
          className="flex items-center gap-2 text-sm text-blue-600 border border-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-600 hover:text-white transition"
        >
          <Plus size={16} />
          Add Category
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-500 py-5">Loading...</p>
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
  );
}

export default CategoryList;
