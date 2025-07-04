
import { useState } from "react";
import { motion } from "framer-motion";
import { useStudents } from "../../hooks/useStudents";
import { useFees } from "../../hooks/useFees";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const RemoveFeeStudent = () => {
  const [formData, setFormData] = useState({
    studentId: "",
    year: "2024-25",
    feeType: ""
  });
  const [loading, setLoading] = useState(false);

  const { students } = useStudents();
  const { fees } = useFees();
  const years = ["2024-25", "2025-26", "2026-27", "2027-28"];

  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
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

      // Remove from student_fees table
      const { error: deleteError } = await supabase
        .from('student_fees')
        .delete()
        .eq('student_id', formData.studentId)
        .eq('fee_name', formData.feeType)
        .eq('year', formData.year);

      if (deleteError) throw deleteError;

      // Add transaction record for the fee removal
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          student_id: formData.studentId,
          description: `Fee removed: ${formData.feeType} (${formData.year})`,
          amount: 0,
          transaction_type: 'fee_removed'
        });

      if (transactionError) throw transactionError;

      toast.success("Fee type removed for this student/year.");
      
      setFormData({
        studentId: "",
        year: "2024-25",
        feeType: ""
      });
    } catch (error) {
      console.error('Error removing fee:', error);
      toast.error("Failed to remove fee. Please try again.");
    } finally {
      setLoading(false);
    }
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
                {student.name} ({student.student_id}) - {student.branch}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          
          <div>
            <label className="block text-gray-300 mb-2">Fee Type:</label>
            <select
              name="feeType"
              value={formData.feeType}
              onChange={handleInputChange}
              required
              disabled={loading}
              className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
            >
              <option value="" className="bg-gray-800">Select Fee Type</option>
              {fees.map(fee => (
                <option key={fee.name} value={fee.name} className="bg-gray-800">{fee.name}</option>
              ))}
            </select>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 px-8 rounded-xl font-semibold transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Removing Fee..." : "Remove Fee for Student"}
        </motion.button>
      </motion.form>
    </div>
  );
};

export default RemoveFeeStudent;
