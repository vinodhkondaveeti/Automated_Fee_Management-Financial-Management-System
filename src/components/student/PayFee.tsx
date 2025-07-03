
import { useState } from "react";
import { motion } from "framer-motion";
import { fees, years, deadlines } from "../../data/mockData";
import { toast } from "sonner";

interface PayFeeProps {
  student: any;
  onPayment: (updatedStudent: any) => void;
}

const PayFee = ({ student, onPayment }: PayFeeProps) => {
  const [selectedYear, setSelectedYear] = useState(years[0]);
  const [selectedFeeType, setSelectedFeeType] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");
  const [lastReceipt, setLastReceipt] = useState<any>(null);
  
  const paymentMethods = [
    "Credit Card", "Debit Card", "UPI Number", "PhonePe", 
    "GooglePay", "Paytm", "Amazon Pay", "PayPal", "Super Money"
  ];

  const getAvailableFees = () => {
    const available = [];
    for (let fee of fees) {
      if (student.feesByYear[selectedYear][fee.name] !== undefined) {
        available.push({ name: fee.name, desc: fee.desc });
      }
    }
    if (student.extraFees) {
      for (let ef of student.extraFees.filter((e: any) => e.year === selectedYear)) {
        available.push({ name: ef.name, desc: ef.name + " (Extra)" });
      }
    }
    return available;
  };

  const getDueAmount = () => {
    if (!selectedFeeType) return 0;
    return student.duesByYear[selectedYear][selectedFeeType] || 0;
  };

  const getButtonColor = () => {
    const deadline = deadlines[selectedFeeType as keyof typeof deadlines];
    if (!deadline) return "bg-blue-500";
    
    const now = new Date();
    const diff = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    
    if (diff > 7) return "bg-green-500 hover:bg-green-600";
    else if (diff > 0) return "bg-orange-500 hover:bg-orange-600";
    else return "bg-red-500 hover:bg-red-600";
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    
    const due = getDueAmount();
    const payAmount = parseInt(amount);
    
    if (!selectedFeeType) {
      toast.error("Please select a fee type");
      return;
    }
    
    if (!payAmount || payAmount < 1) {
      toast.error("Please enter a valid amount");
      return;
    }
    
    if (payAmount > due) {
      toast.error("Amount exceeds due amount");
      return;
    }

    const now = new Date();
    const txnId = "TXN" + now.getTime();
    
    const receipt = {
      time: now.toLocaleTimeString(),
      date: now.toLocaleDateString(),
      student_name: student.name,
      student_course: student.course,
      student_branch: student.branch,
      student_mobile: student.mobile,
      year: selectedYear,
      fee_type: selectedFeeType,
      payment_method: paymentMethod,
      txn_id: txnId,
      paid_amount: payAmount
    };

    // Update student data
    const updatedStudent = { ...student };
    updatedStudent.transactions.push(
      `${receipt.date} ${receipt.time}: Paid ₹${payAmount} for ${selectedFeeType} (${selectedYear}) via ${paymentMethod} [${txnId}]`
    );
    
    updatedStudent.duesByYear[selectedYear][selectedFeeType] -= payAmount;
    if (updatedStudent.duesByYear[selectedYear][selectedFeeType] < 0) {
      updatedStudent.duesByYear[selectedYear][selectedFeeType] = 0;
    }

    // Remove fines if fully paid
    if (updatedStudent.duesByYear[selectedYear][selectedFeeType] === 0) {
      updatedStudent.fines = updatedStudent.fines.filter((fn: any) => fn.feeName !== selectedFeeType);
    }

    onPayment(updatedStudent);
    setLastReceipt(receipt);
    setAmount("");
    toast.success("Payment successful!");
  };

  const downloadReceipt = () => {
    if (!lastReceipt) {
      toast.error("No recent payment to download");
      return;
    }

    // Note: In a real implementation, you would use jsPDF here
    toast.success("Receipt download feature would be implemented with jsPDF");
  };

  return (
    <div className="text-white">
      <h3 className="text-2xl font-bold mb-6">Pay Fee</h3>
      
      <form onSubmit={handlePayment} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 mb-2">Year:</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {years.map(year => (
                <option key={year} value={year} className="bg-gray-800">{year}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-gray-300 mb-2">Fee Type:</label>
            <select
              value={selectedFeeType}
              onChange={(e) => setSelectedFeeType(e.target.value)}
              required
              className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" className="bg-gray-800">Select Fee Type</option>
              {getAvailableFees().map(fee => (
                <option key={fee.name} value={fee.name} className="bg-gray-800">{fee.desc}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 mb-2">Amount:</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              max={getDueAmount()}
              min="1"
              required
              className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={`Max: ₹${getDueAmount()}`}
            />
          </div>
          
          <div>
            <label className="block text-gray-300 mb-2">Payment Method:</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {paymentMethods.map(method => (
                <option key={method} value={method} className="bg-gray-800">{method}</option>
              ))}
            </select>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className={`w-full ${getButtonColor()} text-white py-3 px-6 rounded-xl font-semibold transition-all shadow-lg`}
        >
          Pay ₹{amount || 0}
        </motion.button>
      </form>

      {lastReceipt && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={downloadReceipt}
          className="mt-4 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-xl font-semibold transition-all"
        >
          📄 Download Last Receipt (PDF)
        </motion.button>
      )}
    </div>
  );
};

export default PayFee;
