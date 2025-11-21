import { Eye, EyeOff, X } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import axiosInstance from "../../services/apiClient";

function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { token } = useParams(); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password) {
     toast.error("Password is Required...", {
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
      const res = await axiosInstance.post(`/auth/reset-password/${token}`, {
        password,
      });

      toast.success(res.data.message, {
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

      // 🔥 1–2 seconds delay then go to login
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong", {
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

  const [open, setOpen] = useState(true);
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl p-8 w-[400px] shadow-xl relative">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 mt-2">
            Reset Password
          </h2>

          <button
            onClick={() => setOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 mt-1 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />

            {/* Toggle Button */}
            <span
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-600"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <Eye size={22} /> : <EyeOff size={22} />}
            </span>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
