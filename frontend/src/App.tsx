import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "./services/apiClient";
import { setAuth, clearAuth } from "./redux/slices/authSlice";
import type { RootState } from "./redux/store";

import Sidebar from "./components/Sidebar/Sidebar";
import Dashboard from "./components/Dashboard/Dashboard";
import AddTransaction from "./components/AddTransaction/AddTransaction";
import RecentTransactions from "./components/Dashboard/RecentTransactions/RecentTransactions";
import Register from "./components/Auth/Register";
import Login from "./components/Auth/Login";
import CategoryList from "./components/Category/CategoryList";
import AddCategory from "./components/Category/AddCategory";
import { Toaster } from "react-hot-toast";
import Profile from "./components/Profile/Profile";
import ChangePassword from "./components/Profile/ChangePassword";
import ForgotPassword from "./components/Auth/ForgotPassword";
import ResetPassword from "./components/Auth/ResetPassword";

function App() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const [authChecking, setAuthChecking] = useState(true);

  const hideLayout =
    location.pathname.startsWith("/register") ||
    location.pathname.startsWith("/login") ||
    location.pathname.startsWith("/forgot-password") ||
    location.pathname.startsWith("/reset-password");


  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axiosInstance.get("/auth/check");
        if (res.data.loggedIn) {
          dispatch(setAuth({ user: res.data.user }));
        } else {
          dispatch(clearAuth());
        }
      } catch {
        dispatch(clearAuth());
      } finally {
        setAuthChecking(false);
      }
    };

    checkAuth();
  }, [dispatch]);

  if (authChecking) {
    return (
      <div className="h-screen flex items-center justify-center text-lg text-gray-700">
        Checking authentication...
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-gray-100 overflow-hidden">
      <Toaster position="top-right" toastOptions={{ duration: 5000 }} />

      {hideLayout ? (
        <Routes>
          <Route path="/" element={<Navigate to="/register" />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Routes>
      ) : isAuthenticated ? (
        <div className="flex h-full">
          <Sidebar />

          <div className="flex-1 overflow-y-auto p-8">
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/add-transaction" element={<AddTransaction />} />
              <Route path="/transactions" element={<RecentTransactions />} />
              <Route path="/category" element={<CategoryList />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/change-password" element={<ChangePassword />} />
              <Route path="/add-category" element={<AddCategory />} />
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
          </div>
        </div>
      ) : (
        <Navigate to="/login" replace />
      )}
    </div>
  );
}

export default App;
