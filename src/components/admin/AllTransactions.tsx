
import { motion } from "framer-motion";
import { students } from "../../data/mockData";

const AllTransactions = () => {
  return (
    <div className="text-white">
      <h3 className="text-2xl font-bold mb-6">All Students' Transaction History</h3>
      
      <div className="bg-white/5 rounded-xl p-4 max-h-96 overflow-y-auto">
        {students.every(s => s.transactions.length === 0) ? (
          <p className="text-gray-400 text-center py-8">No transactions yet.</p>
        ) : (
          <div className="space-y-6">
            {students.filter(s => s.transactions.length > 0).map(student => (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/10 rounded-xl p-4 border border-white/10"
              >
                <h4 className="text-lg font-semibold mb-3 text-purple-400">
                  {student.name} ({student.id})
                </h4>
                <div className="space-y-2">
                  {student.transactions.map((transaction: string, index: number) => (
                    <div key={index} className="bg-white/5 rounded-lg p-2 text-sm">
                      {transaction}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllTransactions;
