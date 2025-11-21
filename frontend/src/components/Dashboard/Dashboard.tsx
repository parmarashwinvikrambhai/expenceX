import SummaryCards from "./SummaryCards/SummaryCards";
import SpendingBreakdown from "./SpendingBreakdown/SpendingBreakdown";
import ExpenseTrend from "./ExpenseTrend/ExpenseTrend";
import RecentTransactions from "./RecentTransactions/RecentTransactions";

const Dashboard = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <h1 className="text-2xl font-semibold text-gray-800">
        Dashboard Overview
      </h1>

      {/* Summary cards row */}
      <SummaryCards />

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SpendingBreakdown />
        <ExpenseTrend />
      </div>

      {/* Transactions table */}
      <div>
        <RecentTransactions />
      </div>
    </div>
  );
};

export default Dashboard;
