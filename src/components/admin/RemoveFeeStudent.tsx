
import { useState } from "react";
import { motion } from "framer-motion";
import { students, fees, years } from "../../data/mockData";
import { toast } from "sonner";

const RemoveFeeStudent = () => {
  const [formData, setFormData] = useState({
    name: "",
    pin: "",
    branch: "",
    year: years[0],
    feeType: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const student = students.find(s => 
      s.name === formData.name && 
      s.pin === formData.pin && 
      s.branch === formData.branch
    );
    
    if (!student) {
      toast.error("Student not found. Check name, pin, and branch.");
      return;
    }

    let removed = false;
    
    if (student.feesByYear[formData.year] && student.feesByYear[formData.year][formData.feeType] !== undefined) {
      delete student.feesByYear[formData.year][formData.feeType];
      removed = true;
    }
    
    if (student.duesByYear[formData.year] && student.duesByYear[formData.year][formData.feeType] !== undefined) {
      delete student.duesByYear[formData.year][formData.feeType];
      removed = true;
    }
    
    if (student.extraFees) {
      const originalLength = student.extraFees.length;
      student.extraFees = student.extraFees.filter((ef: any) => !(ef.year === formData.year && ef.name === formData.feeType));
      if (student.extraFees.length < originalLength) removed = true;
    }

    if (removed) {
      toast.success("Fee type removed for this student/year.");
    } else {
      toast.error("Fee type not found for this student/year.");
    }
    
    setFormData({
      name: "",
      pin: "",
      branch: "",
      year: years[0],
      feeType: ""
    });
  };

  return (
    <div className="text-white">
      <h3 className="text-2xl font-bold mb-6">Remove Fee Type for a Particular Student</h3>
      
      <motion.form
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onSubmit={handleSubmit}
        className="space-y-6 max-w-2xl"
      >
        <div>
          <label className="block text-gray-300 mb-2">Student Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 mb-2">Pin Number:</label>
            <input
              type="text"
              name="pin"
              value={formData.pin}
              onChange={handleInputChange}
              required
              className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          
          <div>
            <label className="block text-gray-300 mb-2">Branch:</label>
            <input
              type="text"
              name="branch"
              value={formData.branch}
              onChange={handleInputChange}
              required
              className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 mb-2">Year:</label>
            <select
              name="year"
              value={formData.year}
              onChange={handleInputChange}
              className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {years.map(year => (
                <option key={year} value={year} className="bg-gray-800">{year}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-gray-300 mb-2">Fee Type:</label>
            <select
              name="feeType"
              value={formData.feeType}
              onChange={handleInputChange}
              required
              className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="" className="bg-gray-800">Select Fee Type</option>
              {fees.map(fee => (
                <option key={fee.name} value={fee.name} className="bg-gray-800">{fee.desc}</option>
              ))}
            </select>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 px-8 rounded-xl font-semibold transition-all shadow-lg"
        >
          Remove Fee for Student
        </motion.button>
      </motion.form>
    </div>
  );
};

export default RemoveFeeStudent;
