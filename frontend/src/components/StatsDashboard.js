import { useEffect, useState } from "react";

function StatsDashboard({ refresh }) {

  const [stats, setStats] = useState(null);

  const fetchStats = async () => {
    const res = await fetch("http://127.0.0.1:8000/api/tickets/stats/");
    const data = await res.json();
    setStats(data);
  };

  useEffect(() => {
    fetchStats();
  }, [refresh]);

  if (!stats) return <p>Loading stats...</p>;

  return (
    <div>
      <h2>Stats</h2>

      <p>Total Tickets: {stats.total_tickets}</p>
      <p>Open Tickets: {stats.open_tickets}</p>
      <p>Avg per day: {stats.avg_tickets_per_day}</p>
    </div>
  );
}

export default StatsDashboard;