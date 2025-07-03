
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, Send, Users } from "lucide-react";
import { students, fees } from "../../data/mockData";
import { smsService } from "../../services/smsService";
import { toast } from "sonner";

interface FeeDeadline {
  feeType: string;
  branch: string;
  deadline: Date;
  notificationTime: Date;
}

const FeeDeadlineManager = () => {
  const [deadlines, setDeadlines] = useState<FeeDeadline[]>([]);
  const [selectedFee, setSelectedFee] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [deadlineDate, setDeadlineDate] = useState("");
  const [notificationHours, setNotificationHours] = useState(24);

  const branches = [...new Set(students.map(s => s.branch))];

  useEffect(() => {
    // Check deadlines every minute
    const interval = setInterval(checkDeadlines, 60000);
    return () => clearInterval(interval);
  }, [deadlines]);

  const checkDeadlines = () => {
    const now = new Date();
    
    deadlines.forEach(deadline => {
      if (now >= deadline.notificationTime && now < deadline.deadline) {
        const studentsInBranch = students.filter(s => s.branch === deadline.branch);
        
        studentsInBranch.forEach(student => {
          const message = `Dear ${student.name}, you have less time to pay the ${deadline.feeType} fee. Make sure to pay the fee as soon as possible. Deadline: ${deadline.deadline.toLocaleDateString()}`;
          
          smsService.sendSMS(student.mobile, message);
        });
      }
    });
  };

  const handleSetDeadline = () => {
    if (!selectedFee || !selectedBranch || !deadlineDate) {
      toast.error("Please fill all fields");
      return;
    }

    const deadline = new Date(deadlineDate);
    const notificationTime = new Date(deadline.getTime() - (notificationHours * 60 * 60 * 1000));

    const newDeadline: FeeDeadline = {
      feeType: selectedFee,
      branch: selectedBranch,
      deadline,
      notificationTime
    };

    setDeadlines([...deadlines, newDeadline]);

    // Schedule notifications for students in this branch
    const studentsInBranch = students.filter(s => s.branch === selectedBranch);
    studentsInBranch.forEach(student => {
      const message = `Dear ${student.name}, you have less time to pay the ${selectedFee} fee. Make sure to pay the fee as soon as possible. Deadline: ${deadline.toLocaleDateString()}`;
      
      smsService.scheduleNotification(
        student.id,
        student.mobile,
        message,
        notificationTime
      );
    });

    toast.success(`Deadline set for ${selectedFee} - ${selectedBranch}`);
    
    // Reset form
    setSelectedFee("");
    setSelectedBranch("");
    setDeadlineDate("");
    setNotificationHours(24);
  };

  const handleSendImmediateNotification = (deadline: FeeDeadline) => {
    const studentsInBranch = students.filter(s => s.branch === deadline.branch);
    
    studentsInBranch.forEach(student => {
      const message = `Dear ${student.name}, you have less time to pay the ${deadline.feeType} fee. Make sure to pay the fee as soon as possible. Deadline: ${deadline.deadline.toLocaleDateString()}`;
      
      smsService.sendSMS(student.mobile, message);
    });

    toast.success(`Notifications sent to ${studentsInBranch.length} students in ${deadline.branch}`);
  };

  const removeDeadline = (index: number) => {
    const updatedDeadlines = deadlines.filter((_, i) => i !== index);
    setDeadlines(updatedDeadlines);
    toast.success("Deadline removed");
  };

  return (
    <div className="text-white">
      <h3 className="text-2xl font-bold mb-6">Fee Deadline Manager</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/10 rounded-xl p-6 border border-white/10"
        >
          <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Set Fee Deadline
          </h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-2">Fee Type:</label>
              <select
                value={selectedFee}
                onChange={(e) => setSelectedFee(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select Fee Type</option>
                {fees.map(fee => (
                  <option key={fee.name} value={fee.name} className="bg-gray-800">
                    {fee.desc}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Branch:</label>
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select Branch</option>
                {branches.map(branch => (
                  <option key={branch} value={branch} className="bg-gray-800">
                    {branch}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Deadline Date:</label>
              <input
                type="datetime-local"
                value={deadlineDate}
                onChange={(e) => setDeadlineDate(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Notify Before (hours):</label>
              <input
                type="number"
                min="1"
                max="168"
                value={notificationHours}
                onChange={(e) => setNotificationHours(parseInt(e.target.value))}
                className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSetDeadline}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-xl font-semibold transition-all"
            >
              Set Deadline & Schedule Notifications
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/10 rounded-xl p-6 border border-white/10"
        >
          <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Active Deadlines
          </h4>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {deadlines.length === 0 ? (
              <p className="text-gray-400">No deadlines set</p>
            ) : (
              deadlines.map((deadline, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/5 rounded-lg p-4 border border-white/10"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold">{deadline.feeType}</p>
                      <p className="text-sm text-gray-400">Branch: {deadline.branch}</p>
                    </div>
                    <button
                      onClick={() => removeDeadline(index)}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                  <p className="text-sm text-gray-300">
                    Deadline: {deadline.deadline.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-300">
                    Notify at: {deadline.notificationTime.toLocaleString()}
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSendImmediateNotification(deadline)}
                    className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                  >
                    <Send className="w-3 h-3" />
                    Send Now
                  </motion.button>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FeeDeadlineManager;
