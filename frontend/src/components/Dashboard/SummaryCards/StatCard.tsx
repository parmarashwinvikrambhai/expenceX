import type { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  color?: string;
}

const StatCard = ({
  title,
  value,
  icon,
  color = "bg-indigo-500",
}: StatCardProps) => {
  return (
    <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-all w-full">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <h2 className="text-2xl font-semibold text-gray-800 mt-1">{value}</h2>
      </div>
      <div className={`p-3 rounded-xl text-white ${color}`}>{icon}</div>
    </div>
  );
};

export default StatCard;
