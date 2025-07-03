
import { useState } from "react";
import { motion } from "framer-motion";
import { students } from "../../data/mockData";

const StudentList = () => {
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="text-white">
      <h3 className="text-2xl font-bold mb-6">Student Details</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-lg font-semibold mb-4">Student List</h4>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {students.map((student, index) => (
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
                    style={{ backgroundColor: student.photoColor }}
                  >
                    {getInitials(student.name)}
                  </div>
                  <div>
                    <p className="font-semibold">{student.name}</p>
                    <p className="text-sm text-gray-400">{student.id} - {student.branch}</p>
                    <p className="text-sm text-gray-400">{student.mobile}</p>
                  </div>
                </div>
              </motion.div>
            ))}
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
                  style={{ backgroundColor: selectedStudent.photoColor }}
                >
                  {getInitials(selectedStudent.name)}
                </div>
                <div>
                  <h5 className="text-xl font-bold">{selectedStudent.name}</h5>
                  <p className="text-gray-400">ID: {selectedStudent.id}</p>
                </div>
              </div>
              
              <div className="space-y-2 mb-6">
                <p><span className="font-semibold">Pin:</span> {selectedStudent.pin}</p>
                <p><span className="font-semibold">Course:</span> {selectedStudent.course}</p>
                <p><span className="font-semibold">Branch:</span> {selectedStudent.branch}</p>
                <p><span className="font-semibold">Mobile:</span> {selectedStudent.mobile}</p>
              </div>

              <div>
                <h6 className="font-semibold mb-3">Fee Status by Year:</h6>
                <div className="space-y-3">
                  {Object.keys(selectedStudent.feesByYear).map(year => (
                    <div key={year} className="bg-white/5 rounded-lg p-3">
                      <p className="font-semibold mb-2">{year}</p>
                      <div className="space-y-1 text-sm">
                        {Object.entries(selectedStudent.feesByYear[year]).map(([feeType, amount]) => (
                          <div key={feeType} className="flex justify-between">
                            <span>{feeType}:</span>
                            <span>Fee ₹{amount as number}, Due ₹{selectedStudent.duesByYear[year][feeType] || 0}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {selectedStudent.transactions.length > 0 && (
                <div className="mt-6">
                  <h6 className="font-semibold mb-3">Recent Transactions:</h6>
                  <div className="bg-white/5 rounded-lg p-3 max-h-32 overflow-y-auto">
                    {selectedStudent.transactions.slice(-3).map((transaction: string, index: number) => (
                      <p key={index} className="text-sm mb-1">{transaction}</p>
                    ))}
                  </div>
                </div>
              )}
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
