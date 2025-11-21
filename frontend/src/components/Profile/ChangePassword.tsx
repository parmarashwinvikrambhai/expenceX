import React, { useState } from "react";
import { Eye, EyeOff, Loader, X } from "lucide-react";
import axiosInstance from "../../services/apiClient";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";


const ChangePassword = () => {
  const [Password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showForm, setShowForm] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

    
  const navigate = useNavigate();


  const handleClose = () => {
    setShowForm(false);
    navigate("/profile");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // blank field check
    if (Password.trim() === "" || newPassword.trim() === "") {
      toast.error("You must fill all the fields!", {
        style: {
          borderRadius: "8px",
          background: "#dc2626",
          color: "#fff",
          fontWeight: 600,
          padding: "12px 16px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
        },
      });
      return;
    }

    // min length validation
    if (Password.length < 6 || newPassword.length < 6) {
      toast.error("Your Password must be at least 6 character!", {
        style: {
          borderRadius: "8px",
          background: "#dc2626",
          color: "#fff",
          fontWeight: 600,
          padding: "12px 16px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
        },
      });
      return;
    }

    try {
      await axiosInstance.put("/auth/change-password", {
        Password,
        newPassword,
      });

      toast.success("Password change successfully", {
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

      setPassword("");
      setNewPassword("");

      setTimeout(() => {
        setShowForm(false);
        navigate("/profile");
      }, 600);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Failed to update password!",
        {
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
        }
      );
    } finally {
      setLoading(false);
    }
  };

if (!showForm) return null;
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex justify-center items-center z-50">
      {loading && (
        <div className="fixed inset-0 backdrop-blur-md  bg-black/20 flex items-center justify-center z-9999">
          <Loader size={50} className="animate-spin text-black" />
        </div>
      )}
      <div className="bg-white rounded-2xl p-8 w-[400px] shadow-xl relative">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 text-center mt-2">
            Change Password
          </h2>
          <button
            onClick={handleClose}
            className="top-3 right-3 text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Current Password */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">
              Current Password
            </label>

            <input
              type={showPassword ? "text" : "password"}
              value={Password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-400 rounded-md px-3 py-2 mt-1 outline-none"
            />

            {/* Eye Icon */}
            <span
              className="absolute right-3 top-[35px] cursor-pointer text-gray-600"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <Eye size={22} /> : <EyeOff size={22} />}
            </span>
          </div>

          {/* New Password */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">
              New Password
            </label>

            <input
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border border-gray-400 rounded-md px-3 py-2 mt-1 outline-none"
            />

            {/* Eye Icon */}
            <span
              className="absolute right-3 top-[35px] cursor-pointer text-gray-600"
              onClick={() => setShowNewPassword((prev) => !prev)}
            >
              {showNewPassword ? <Eye size={22} /> : <EyeOff size={22} />}
            </span>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
