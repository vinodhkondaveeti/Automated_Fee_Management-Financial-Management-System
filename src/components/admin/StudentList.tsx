
import { useState } from "react";
import { motion } from "framer-motion";
import { useStudents } from "../../hooks/useStudents";

const StudentList = () => {
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const { students, loading } = useStudents();

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (loading) {
    return (
      <div className="text-white text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
        <p className="mt-4">Loading students...</p>
      </div>
    );
  }

  return (
    <div className="text-white">
      <h3 className="text-2xl font-bold mb-6">Student Details</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-lg font-semibold mb-4">Student List ({students.length})</h4>
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
                  onClick={() => setSelectedStudent(student)}
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
          {selectedStudent ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white/10 rounded-xl p-6 border border-white/10"
            >
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
              
              <div className="space-y-2 mb-6">
                <p><span className="font-semibold">Pin:</span> {selectedStudent.pin}</p>
                <p><span className="font-semibold">Course:</span> {selectedStudent.course}</p>
                <p><span className="font-semibold">Branch:</span> {selectedStudent.branch}</p>
                <p><span className="font-semibold">Mobile:</span> {selectedStudent.mobile}</p>
                <p><span className="font-semibold">Created:</span> {new Date(selectedStudent.created_at).toLocaleDateString()}</p>
              </div>

              <div className="bg-white/5 rounded-lg p-3">
                <p className="text-sm text-gray-300">
                  Real-time data from Supabase database
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Changes sync automatically across all devices
                </p>
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
