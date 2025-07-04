
import { useState } from "react";
import { motion } from "framer-motion";
import { useStudents } from "../../hooks/useStudents";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const AddExtraFee = () => {
  const [formData, setFormData] = useState({
    studentId: "",
    year: "2024-25",
    name: "",
    desc: "",
    amount: ""
  });
  const [loading, setLoading] = useState(false);

  const { students } = useStudents();
  const years = ["2024-25", "2025-26", "2026-27", "2027-28"];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const student = students.find(s => s.id === formData.studentId);
      if (!student) {
        toast.error("Student not found");
        return;
      }

      const amount = parseInt(formData.amount);
      
      // Add to student_fees table
      const { error: feeError } = await supabase
        .from('student_fees')
        .insert({
          student_id: formData.studentId,
          fee_name: formData.name,
          year: formData.year,
          total_amount: amount,
          due_amount: amount,
          paid_amount: 0
        });

      if (feeError) throw feeError;

      // Add transaction record for the extra fee
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          student_id: formData.studentId,
          description: `Extra fee added: ${formData.desc} (${formData.year})`,
          amount: amount,
          transaction_type: 'fee_added'
        });

      if (transactionError) throw transactionError;

      toast.success("Extra fee added successfully!");
      
      setFormData({
        studentId: "",
        year: "2024-25",
        name: "",
        desc: "",
        amount: ""
      });
    } catch (error) {
      console.error('Error adding extra fee:', error);
      toast.error("Failed to add extra fee. Please try again.");
    } finally {
      setLoading(false);
    }
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
              disabled={loading}
              className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
            >
              <option value="" className="bg-gray-800">Select Student</option>
              {students.map(student => (
                <option key={student.id} value={student.id} className="bg-gray-800">
                  {student.name} ({student.student_id})
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
              disabled={loading}
              className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
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
            disabled={loading}
            className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
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
            disabled={loading}
            className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
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
            disabled={loading}
            className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
          />
        </div>

        <motion.button
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-8 rounded-xl font-semibold transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Adding Extra Fee..." : "Add Extra Fee"}
        </motion.button>
      </motion.form>
    </div>
  );
};

export default AddExtraFee;
