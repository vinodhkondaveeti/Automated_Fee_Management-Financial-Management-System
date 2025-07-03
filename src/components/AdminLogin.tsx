
import { useState } from "react";
import { motion } from "framer-motion";
import LoginBackground from "./backgrounds/LoginBackground";
import { admins } from "../data/mockData";

interface AdminLoginProps {
  onLogin: (user: any) => void;
  onBack: () => void;
}

const AdminLogin = ({ onLogin, onBack }: AdminLoginProps) => {
  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const admin = admins.find(a => a.id === adminId && a.password === password);
    if (admin) {
      onLogin(admin);
    } else {
      setError("Invalid Admin ID or Password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      <LoginBackground />
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="relative z-10 bg-black/20 backdrop-blur-lg border border-white/20 rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl"
      >
        <motion.h2 
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-3xl font-bold text-white text-center mb-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
        >
          Admin Login
        </motion.h2>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-gray-300 mb-2">Admin ID</label>
            <input
              type="text"
              value={adminId}
              onChange={(e) => setAdminId(e.target.value)}
              className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your admin ID"
              required
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your password"
              required
            />
          </div>
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-400 text-center"
            >
              {error}
            </motion.div>
          )}
          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 hover:from-purple-600 hover:to-pink-600 shadow-lg"
            >
              Login
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={onBack}
              className="w-full bg-gray-600 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 hover:bg-gray-700 shadow-lg"
            >
              Back
            </motion.button>
          </div>
        </form>
        <div className="mt-6 text-center text-gray-400 text-sm">
          Demo: ID: A1, Password: admin1
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
