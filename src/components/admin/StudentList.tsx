
import { useState } from "react";
import { motion } from "framer-motion";
import { useStudents } from "../../hooks/useStudents";
import { useFees } from "../../hooks/useFees";
import { supabase } from "@/integrations/supabase/client";

const StudentList = () => {
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [studentFees, setStudentFees] = useState<any[]>([]);
  const [studentTransactions, setStudentTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { students, loading: studentsLoading } = useStudents();

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const fetchStudentDetails = async (student: any) => {
    setLoading(true);
    try {
      // Fetch student fees
      const { data: fees, error: feesError } = await supabase
        .from('student_fees')
        .select('*')
        .eq('student_id', student.id);

      if (feesError) throw feesError;

      // Fetch student transactions
      const { data: transactions, error: transactionsError } = await supabase
        .from('transactions')
        .select('*')
        .eq('student_id', student.id)
        .order('created_at', { ascending: false });

      if (transactionsError) throw transactionsError;

      setStudentFees(fees || []);
      setStudentTransactions(transactions || []);
      setSelectedStudent(student);
    } catch (error) {
      console.error('Error fetching student details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (studentsLoading) {
    return (
      <div className="text-white text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
        <p className="mt-4">Loading students...</p>
      </div>
    );
  }

  return (
    <div className="text-white">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold">Student Details</h3>
        <div className="bg-purple-500/20 rounded-xl px-4 py-2 border border-purple-500/30">
          <span className="text-purple-300 font-semibold">Total Students: {students.length}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h4 className="text-lg font-semibold mb-4">Student List</h4>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {students.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <p>No students found</p>
                <p className="text-sm">Add students to get started</p>
              </div>
            ) : (
              students.map((student, index) => (
                <motion.div
                  key={student.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => fetchStudentDetails(student)}
                  className="bg-white/10 hover:bg-white/20 rounded-xl p-4 cursor-pointer transition-all border border-white/10"
                >
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
                      style={{ backgroundColor: student.photo_color }}
                    >
                      {getInitials(student.name)}
                    </div>
                    <div>
                      <p className="font-semibold">{student.name}</p>
                      <p className="text-sm text-gray-400">{student.student_id} - {student.branch}</p>
                      <p className="text-sm text-gray-400">{student.mobile}</p>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-4">Student Details</h4>
          {loading ? (
            <div className="bg-white/10 rounded-xl p-6 border border-white/10 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
              <p>Loading details...</p>
            </div>
          ) : selectedStudent ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white/10 rounded-xl p-6 border border-white/10 space-y-6"
            >
              {/* Basic Info */}
              <div className="flex items-center space-x-4 mb-6">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold"
                  style={{ backgroundColor: selectedStudent.photo_color }}
                >
                  {getInitials(selectedStudent.name)}
                </div>
                <div>
                  <h5 className="text-xl font-bold">{selectedStudent.name}</h5>
                  <p className="text-gray-400">ID: {selectedStudent.student_id}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <p><span className="font-semibold">Pin:</span> {selectedStudent.pin}</p>
                <p><span className="font-semibold">Course:</span> {selectedStudent.course}</p>
                <p><span className="font-semibold">Branch:</span> {selectedStudent.branch}</p>
                <p><span className="font-semibold">Mobile:</span> {selectedStudent.mobile}</p>
                <p><span className="font-semibold">Created:</span> {new Date(selectedStudent.created_at).toLocaleDateString()}</p>
              </div>

              {/* Fee Details */}
              <div className="bg-white/5 rounded-lg p-4">
                <h6 className="font-semibold mb-3 text-blue-300">Fee Records</h6>
                {studentFees.length === 0 ? (
                  <p className="text-gray-400 text-sm">No fee records found</p>
                ) : (
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {studentFees.map((fee, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{fee.fee_name} ({fee.year})</span>
                        <span className="text-right">
                          <span className="text-green-400">₹{fee.total_amount.toLocaleString()}</span>
                          {fee.due_amount > 0 && (
                            <span className="text-red-400 ml-2">(Due: ₹{fee.due_amount.toLocaleString()})</span>
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Transaction History */}
              <div className="bg-white/5 rounded-lg p-4">
                <h6 className="font-semibold mb-3 text-green-300">Transaction History</h6>
                {studentTransactions.length === 0 ? (
                  <p className="text-gray-400 text-sm">No transactions found</p>
                ) : (
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {studentTransactions.map((transaction, index) => (
                      <div key={index} className="text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-300">{new Date(transaction.created_at).toLocaleDateString()}</span>
                          <span className="text-green-400">₹{transaction.amount.toLocaleString()}</span>
                        </div>
                        <p className="text-gray-400 text-xs">{transaction.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <div className="bg-white/10 rounded-xl p-6 border border-white/10 text-center text-gray-400">
              Click on a student to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentList;
