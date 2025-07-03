
import { useState } from "react";
import { motion } from "framer-motion";
import { fees, years } from "../../data/mockData";

interface FeeDueProps {
  student: any;
}

const FeeDue = ({ student }: FeeDueProps) => {
  const [selectedYear, setSelectedYear] = useState(years[0]);

  return (
    <div className="text-white">
      <h3 className="text-2xl font-bold mb-6">Fee Due Details</h3>
      
      <div className="mb-6">
        <label className="block text-gray-300 mb-2">Select Year:</label>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="bg-white/10 border border-white/20 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {years.map(year => (
            <option key={year} value={year} className="bg-gray-800">{year}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-white/20">
              <th className="text-left p-3 text-gray-300">Type</th>
              <th className="text-left p-3 text-gray-300">Description</th>
              <th className="text-left p-3 text-gray-300">Due Amount</th>
            </tr>
          </thead>
          <tbody>
            {fees.map(fee => {
              const due = student.duesByYear[selectedYear][fee.name] || 0;
              const hasFine = student.fines.some((fn: any) => fn.feeName === fee.name);
              
              return (
                <motion.tr
                  key={fee.name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`border-b border-white/10 ${due > 0 && hasFine ? 'text-red-400' : ''}`}
                >
                  <td className="p-3">{fee.name}</td>
                  <td className="p-3">{fee.desc}</td>
                  <td className="p-3">₹{due}</td>
                </motion.tr>
              );
            })}
            {student.extraFees?.filter((ef: any) => ef.year === selectedYear).map((ef: any, index: number) => {
              const due = student.duesByYear[selectedYear][ef.name] || 0;
              
              return (
                <motion.tr
                  key={`extra-${index}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b border-white/10 text-red-400"
                >
                  <td className="p-3">{ef.name}</td>
                  <td className="p-3">{ef.desc}</td>
                  <td className="p-3">₹{due}</td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FeeDue;
