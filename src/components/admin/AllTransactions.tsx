
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

const AllTransactions = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          students:student_id (
            name,
            student_id,
            branch
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-white text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
        <p className="mt-4">Loading transactions...</p>
      </div>
    );
  }

  return (
    <div className="text-white">
      <h3 className="text-2xl font-bold mb-6">All Students' Transaction History</h3>
      
      <div className="bg-white/5 rounded-xl p-4 max-h-96 overflow-y-auto">
        {transactions.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No transactions yet.</p>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction, index) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white/10 rounded-xl p-4 border border-white/10"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="text-lg font-semibold text-purple-400">
                      {transaction.students?.name} ({transaction.students?.student_id})
                    </h4>
                    <p className="text-sm text-gray-400">Branch: {transaction.students?.branch}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-green-400 font-bold">₹{transaction.amount.toLocaleString()}</p>
                    <p className="text-sm text-gray-400">{new Date(transaction.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-sm text-gray-300">{transaction.description}</p>
                  <p className="text-xs text-gray-400 mt-1">Type: {transaction.transaction_type}</p>
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
