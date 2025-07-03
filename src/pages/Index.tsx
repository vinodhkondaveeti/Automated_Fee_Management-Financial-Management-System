
import { useState } from "react";
import { motion } from "framer-motion";
import StudentLogin from "../components/StudentLogin";
import AdminLogin from "../components/AdminLogin";
import StudentDashboard from "../components/StudentDashboard";
import AdminDashboard from "../components/AdminDashboard";
import WelcomeBackground from "../components/backgrounds/WelcomeBackground";

type CurrentView = 'welcome' | 'student-login' | 'admin-login' | 'student-dashboard' | 'admin-dashboard';

const Index = () => {
  const [currentView, setCurrentView] = useState<CurrentView>('welcome');
  const [currentUser, setCurrentUser] = useState<any>(null);

  const handleNavigation = (view: CurrentView, user?: any) => {
    setCurrentView(view);
    if (user) setCurrentUser(user);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'student-login':
        return <StudentLogin onLogin={(user) => handleNavigation('student-dashboard', user)} onBack={() => handleNavigation('welcome')} />;
      case 'admin-login':
        return <AdminLogin onLogin={(user) => handleNavigation('admin-dashboard', user)} onBack={() => handleNavigation('welcome')} />;
      case 'student-dashboard':
        return <StudentDashboard user={currentUser} onLogout={() => handleNavigation('welcome')} />;
      case 'admin-dashboard':
        return <AdminDashboard user={currentUser} onLogout={() => handleNavigation('welcome')} />;
      default:
        return (
          <div className="min-h-screen flex items-center justify-center relative">
            <WelcomeBackground />
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative z-10 bg-black/20 backdrop-blur-lg border border-white/20 rounded-3xl p-12 max-w-md w-full mx-4 shadow-2xl"
            >
              <motion.h1 
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl font-bold text-white text-center mb-8 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
              >
                Fee Portal Nexus
              </motion.h1>
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-gray-300 text-center mb-8"
              >
                Advanced Student & Administration Fee Management System
              </motion.p>
              <div className="space-y-4">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(59, 130, 246, 0.5)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleNavigation('student-login')}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 hover:from-blue-600 hover:to-cyan-600 shadow-lg"
                >
                  Student Portal
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(168, 85, 247, 0.5)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleNavigation('admin-login')}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 hover:from-purple-600 hover:to-pink-600 shadow-lg"
                >
                  Administration Portal
                </motion.button>
              </div>
            </motion.div>
          </div>
        );
    }
  };

  return <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
    {renderContent()}
  </div>;
};

export default Index;
