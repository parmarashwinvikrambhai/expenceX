import { useState } from "react";
import axiosInstance from "../../services/apiClient";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAuth } from "../../redux/slices/authSlice";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";


function Login() {

    const [email,setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<{
     
      email?: string;
      password?: string;
      general?: string;
    }>({});

  const navigate = useNavigate();
  const dispatch = useDispatch();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      const res = await axiosInstance.post("/auth/login", { email, password });
      dispatch(setAuth({ user: res.data.user }));
      toast.success("Login successfully", {
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
      navigate("/dashboard");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (err.response?.data?.errors) {
        const fieldErrors: Record<string, string> = {};
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        err.response.data.errors.forEach((e: any) => {
          fieldErrors[e.field] = e.message;
        });
        setErrors(fieldErrors);
      } else {
        setErrors({
          general: err.response?.data?.message || "login failed",
        });
      }
    }
  };


  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {/* Background Blur */}
      <div className="absolute inset-0 bg-indigo-200 bg-opacity-40 backdrop-blur-md"></div>

      {/* Form Container */}
      <div className="relative grid max-w-7xl grid-cols-1 gap-8 px-8 py-16 mx-auto rounded-lg md:grid-cols-2 md:px-12 lg:px-16 xl:px-32 bg-white shadow-xl">
        {/* Left Section */}
        <div className="flex flex-col justify-between">
          <div className="space-y-2">
            <h2 className="text-4xl font-bold leading-tight lg:text-5xl text-indigo-700">
              Sign In
            </h2>
            <p className="text-gray-600">Login now to access your dashboard.</p>
          </div>
          <img
            src="https://mambaui.com/assets/svg/doodle.svg"
            alt="Illustration"
            className="p-6 h-52 md:h-64"
          />
        </div>

        {/* Right Section - Form */}
        <form
          noValidate
          className="space-y-6 text-gray-800"
          onSubmit={handleSubmit}
        >
          {errors.general && (
            <p className="bg-red-100 text-red-600 p-2 rounded text-center">
              {errors.general}
            </p>
          )}
          <div>
            <label htmlFor="email" className="text-large font-medium">
              Email
            </label>
            <input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Enter email"
              className="w-full p-3 mt-1 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="Password" className="text-large font-medium">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password"
                className="w-full p-3 mt-1 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                required
              />

              {/* Eye Icon */}
              <span
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-600"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <Eye size={22} /> : <EyeOff size={22} />}
              </span>
            </div>

            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
            <div>
              <p className="mt-1">
                Need an account ?{" "}
                <Link to="/register" className="text-blue-500">
                  Sign up
                </Link>
              </p>
            </div>
          </div>

          <button
            type="submit"
            className="w-full p-3 text-sm font-bold tracking-wide uppercase rounded bg-indigo-600 text-white hover:bg-indigo-700 transition"
          >
            Login
          </button>
          <div className="text-center">
            <span>
              <Link to="/forgot-password" className="text-blue-500">
                Forgot password ?
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login