
import { useState } from "react";
import { motion } from "framer-motion";
import { students, years } from "../../data/mockData";
import { toast } from "sonner";

const AddExtraFee = () => {
  const [formData, setFormData] = useState({
    studentId: "",
    year: years[0],
    name: "",
    desc: "",
    amount: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const student = students.find(s => s.id === formData.studentId);
    if (!student) {
      toast.error("Student not found");
      return;
    }

    const amount = parseInt(formData.amount);
    
    if (!student.feesByYear[formData.year]) student.feesByYear[formData.year] = {};
    if (!student.duesByYear[formData.year]) student.duesByYear[formData.year] = {};
    
    student.feesByYear[formData.year][formData.name] = amount;
    student.duesByYear[formData.year][formData.name] = (student.duesByYear[formData.year][formData.name] || 0) + amount;
    
    if (!student.extraFees) student.extraFees = [];
    student.extraFees.push({
      year: formData.year,
      name: formData.name,
      desc: formData.desc,
      amount: amount
    });

    toast.success("Extra fee added successfully!");
    
    setFormData({
      studentId: "",
      year: years[0],
      name: "",
      desc: "",
      amount: ""
    });
  };

  return (
    <div className="text-white">
      <h3 className="text-2xl font-bold mb-6">Add Extra Fee to Student</h3>
      
      <motion.form
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onSubmit={handleSubmit}
        className="space-y-6 max-w-2xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 mb-2">Student:</label>
            <select
              name="studentId"
              value={formData.studentId}
              onChange={handleInputChange}
              required
              className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="" className="bg-gray-800">Select Student</option>
              {students.map(student => (
                <option key={student.id} value={student.id} className="bg-gray-800">
                  {student.name} ({student.id})
                </option>
              ))}
            </select>
          </div>
          
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
        </div>

        <div>
          <label className="block text-gray-300 mb-2">Fee/Fine Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2">Description:</label>
          <input
            type="text"
            name="desc"
            value={formData.desc}
            onChange={handleInputChange}
            required
            className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2">Amount:</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleInputChange}
            min="1"
            required
            className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-8 rounded-xl font-semibold transition-all shadow-lg"
        >
          Add Extra Fee
        </motion.button>
      </motion.form>
    </div>
  );
};

export default AddExtraFee;
