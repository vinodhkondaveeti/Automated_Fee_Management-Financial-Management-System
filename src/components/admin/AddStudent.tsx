
import { useState } from "react";
import { motion } from "framer-motion";
import { students, fees, years } from "../../data/mockData";
import { toast } from "sonner";

const AddStudent = () => {
  const [formData, setFormData] = useState({
    id: "",
    password: "",
    name: "",
    pin: "",
    course: "B.Tech",
    branch: "",
    mobile: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateUniquePin = (pin: string): boolean => {
    return !students.some(s => s.pin === pin);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate Student ID uniqueness
    if (students.some(s => s.id === formData.id)) {
      toast.error("Student ID already exists");
      return;
    }

    // Validate Pin uniqueness
    if (!validateUniquePin(formData.pin)) {
      toast.error("Pin number already exists. Please use a unique pin number.");
      return;
    }

    // Validate mobile number
    if (formData.mobile.length !== 10 || !/^\d+$/.test(formData.mobile)) {
      toast.error("Mobile number must be exactly 10 digits");
      return;
    }

    const feesByYear: any = {};
    const duesByYear: any = {};
    
    for (let y of years) {
      feesByYear[y] = {};
      duesByYear[y] = {};
      for (let f of fees) {
        feesByYear[y][f.name] = f.amount;
        duesByYear[y][f.name] = f.amount;
      }
    }

    const newStudent = {
      ...formData,
      photoColor: `#${Math.floor(Math.random()*16777215).toString(16)}`,
      feesByYear,
      duesByYear,
      fines: [],
      extraFees: [],
      transactions: []
    };

    students.push(newStudent);
    toast.success("Student added successfully!");
    
    setFormData({
      id: "",
      password: "",
      name: "",
      pin: "",
      course: "B.Tech",
      branch: "",
      mobile: ""
    });
  };

  return (
    <div className="text-white">
      <h3 className="text-2xl font-bold mb-6">Add Student</h3>
      
      <motion.form
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onSubmit={handleSubmit}
        className="space-y-6 max-w-2xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 mb-2">Student ID:</label>
            <input
              type="text"
              name="id"
              value={formData.id}
              onChange={handleInputChange}
              required
              className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          
          <div>
            <label className="block text-gray-300 mb-2">Password:</label>
            <input
              type="text"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-300 mb-2">Name:</label>
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
            <label className="block text-gray-300 mb-2">Pin No (Unique):</label>
            <input
              type="text"
              name="pin"
              value={formData.pin}
              onChange={handleInputChange}
              required
              className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {formData.pin && !validateUniquePin(formData.pin) && (
              <p className="text-red-400 text-sm mt-1">This pin number already exists</p>
            )}
          </div>
          
          <div>
            <label className="block text-gray-300 mb-2">Course:</label>
            <input
              type="text"
              name="course"
              value={formData.course}
              onChange={handleInputChange}
              required
              className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          
          <div>
            <label className="block text-gray-300 mb-2">Mobile (10 digits):</label>
            <input
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleInputChange}
              required
              pattern="[0-9]{10}"
              maxLength={10}
              className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-8 rounded-xl font-semibold transition-all shadow-lg"
        >
          Add Student
        </motion.button>
      </motion.form>
    </div>
  );
};

export default AddStudent;
