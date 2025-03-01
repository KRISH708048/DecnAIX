import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Wallet } from "lucide-react";

export default function ProviderTransactions() {
  const [transactions] = useState([
    {
      version: "2401156913",
      timestamp: "02/23/2025 22:58:42.947",
      sender: "0x2d9e...6b6a",
      sentTo: "Tevi",
      function: "TeviStar::star_transfer",
      gas: "-0.000011 APT",
      amount: "0 APT",
    },
    {
      version: "2401156912",
      timestamp: "02/23/2025 22:58:42.947",
      sender: "0x6dda...92c6",
      sentTo: "Tevi",
      function: "TeviStar::fund_transfer",
      gas: "-0.000013 APT",
      amount: "0 APT",
    },
    {
      version: "2401156911",
      timestamp: "02/23/2025 22:58:42.947",
      sender: "0xab69...234e",
      sentTo: "0x2387...172f",
      function: "esports_game_tracker::transfer_reward",
      gas: "-0.000016 APT",
      amount: "0 APT",
    },
  ]);

  return (
    <Card className="bg-[#5b2333] text-white border border-gray-700 shadow-lg rounded-2xl">
      <CardHeader className="flex justify-between items-center border-b border-gray-600 p-4">
        <CardTitle className="text-lg font-semibold">User Transactions</CardTitle>
        <Button className="bg-[#ffd700] text-black font-bold hover:bg-[#e6c200]">
          Reload
        </Button>
      </CardHeader>

      <CardContent className="overflow-x-auto p-4">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-500 text-gray-300">
              <th className="py-2 px-4">Version</th>
              <th className="py-2 px-4">Timestamp</th>
              <th className="py-2 px-4">Sender</th>
              <th className="py-2 px-4">Sent To</th>
              <th className="py-2 px-4">Function</th>
              <th className="py-2 px-4">Gas Fee</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx, index) => (
              <tr key={index} className="border-b border-gray-700 hover:bg-[#6e2a3e] transition">
                <td className="py-2 px-4 text-[#ffcc00] cursor-pointer">{tx.version}</td>
                <td className="py-2 px-4">{tx.timestamp}</td>
                <td className="py-2 px-4 flex items-center gap-2">
                  <Wallet size={16} className="text-[#00e676]" />
                  {tx.sender}
                  <Copy size={14} className="cursor-pointer text-gray-400 hover:text-white" />
                </td>
                <td className="py-2 px-4">{tx.sentTo}</td>
                <td className="py-2 px-4 truncate max-w-xs">{tx.function}</td>
                <td className="py-2 px-4 text-red-400">{tx.gas}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
