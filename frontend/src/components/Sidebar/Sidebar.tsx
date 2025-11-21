import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  CreditCard,
  PieChart,
  LogOut,
  Menu,
  UserRoundPen,
  X,
} from "lucide-react";
import axiosInstance from "../../services/apiClient";
import { clearAuth } from "../../redux/slices/authSlice";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const menuItems = [
    { name: "Dashboard", icon: <Home size={20} />, path: "/dashboard" },
    {
      name: "Transactions",
      icon: <CreditCard size={20} />,
      path: "/transactions",
    },
    { name: "Category", icon: <PieChart size={20} />, path: "/category" },
    { name: "Profile", icon: <UserRoundPen size={20} />, path: "/profile" },
  ];

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
      dispatch(clearAuth());
      toast.success("Logout successfully", {
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
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      {/* MOBILE TOP BAR */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-gray-900 text-white p-4 flex justify-between items-center z-50">
        <h1 className="text-xl font-bold">ExpenseX</h1>

        <button onClick={() => setMobileOpen(true)} className="text-white">
          <Menu size={26} />
        </button>
      </div>

      {/* MOBILE SIDEBAR DRAWER */}
      <div
        className={`fixed top-0 left-0 h-full bg-gray-900 text-white z-50 transform transition-transform duration-300 md:hidden
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        style={{ width: "250px" }}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h1 className="text-xl font-bold">Menu</h1>
          <button onClick={() => setMobileOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <nav className="mt-4">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 text-sm rounded-md mx-2 my-1 
                transition-all 
                ${
                  isActive
                    ? "bg-indigo-600 text-white"
                    : "text-gray-300 hover:bg-gray-800"
                }`
              }
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-gray-300 hover:text-white"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>

      {/* BACKDROP FOR MOBILE SIDEBAR */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        ></div>
      )}

      {/* DESKTOP SIDEBAR */}
      <div
        className={`
          hidden md:flex h-full bg-gray-900 text-white flex-col transition-all duration-300 
          ${isOpen ? "w-64" : "w-20"}
        `}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center">
            <img
              src="https://cdn3d.iconscout.com/3d/premium/thumb/online-expensive-report-3d-icon-png-download-5727732.png"
              alt="logo"
              className="w-10"
            />
            {isOpen && <h1 className="text-xl font-bold ml-2">ExpenseX</h1>}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-400 hover:text-white"
          >
            <Menu size={22} />
          </button>
        </div>

        <nav className="flex-1 mt-6 overflow-y-auto">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 text-sm rounded-md mx-2 my-1 
                transition-all duration-200 
                ${
                  isActive
                    ? "bg-indigo-600 text-white"
                    : "text-gray-400 hover:bg-gray-800"
                }`
              }
            >
              {item.icon}
              {isOpen && <span>{item.name}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-gray-400 hover:text-white"
          >
            <LogOut size={20} />
            {isOpen && <span>Logout</span>}
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
