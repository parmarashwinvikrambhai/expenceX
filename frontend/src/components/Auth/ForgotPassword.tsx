import { X } from "lucide-react";
import { useState } from "react";
import axiosInstance from "../../services/apiClient";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";


function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
     if (!email) {
       toast.error("Email is Required...", {
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

       setLoading(false);
       return;
     }

    try {
      const res = await axiosInstance.post("/auth/forgot-password", {email});

      toast.success(res.data.message || "Email sent successfully!", {
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
      
      setEmail("");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Something went wrong", {
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
  if (!open) return null; 
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl p-8 w-[400px] shadow-xl relative">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 mt-2">
            Forgot Password
          </h2>

          <button
            onClick={() => navigate("/login")}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="text-large font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter email"
              className="w-full p-3 mt-1 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400"
          >
            {loading ? "Sending..." : "Send Email"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
