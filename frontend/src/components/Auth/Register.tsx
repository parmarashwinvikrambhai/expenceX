import { Eye, EyeOff } from "lucide-react";
import axiosInstance from "../../services/apiClient";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setpassword] = useState("");
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    general?: string;
  }>({});
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({}); 

    try {
      await axiosInstance.post("/auth/register", {name,email,password});
      navigate("/login");
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
          general: err.response?.data?.message || "Registration failed",
        });
      }
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {/* Background Blur */}
      <div className="absolute inset-0 bg-indigo-200 bg-opacity-40 backdrop-blur-md"></div>

      {/* Form Container */}
      <div className="relative grid max-w-7xl grid-cols-1 gap-7 px-8 py-16 mx-auto rounded-lg md:grid-cols-2 md:px-12 lg:px-16 xl:px-32 bg-white shadow-xl">
        {/* Left Section */}
        <div className="flex flex-col justify-between">
          <div className="space-y-2">
            <h2 className="text-4xl font-bold leading-tight lg:text-5xl text-indigo-700">
              Create Account
            </h2>
            <p className="text-gray-600">
              Register now to access your dashboard.
            </p>
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
          className="space-y-4 text-gray-800"
          onSubmit={handleSubmit}
        >
          {/* General error */}
          {errors.general && (
            <p className="bg-red-100 text-red-600 p-2 rounded text-center">
              {errors.general}
            </p>
          )}

          {/* Name Field */}
          <div>
            <label htmlFor="name" className="text-large font-medium">
              Name
            </label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="John Doe"
              className="w-full p-3 mt-1 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="text-large font-medium">
              Email
            </label>
            <input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="example@gmail.com"
              className="w-full p-3 mt-1 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          {/* Password Field */}
          <div>
            <label htmlFor="password" className="text-large font-medium">
              Password
            </label>

            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setpassword(e.target.value)}
                placeholder="1234@#"
                className="w-full p-3 mt-1 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                required
              />

              {/* Toggle Button */}
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

            <p className="mt-1">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-500">
                Sign in
              </Link>
            </p>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full p-3 text-sm font-bold tracking-wide uppercase rounded bg-indigo-600 text-white hover:bg-indigo-700 transition"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
