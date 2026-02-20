import { useEffect, useState } from "react";

function TicketList({ refresh }) {

  const [tickets, setTickets] = useState([]);

  const fetchTickets = async () => {
    const res = await fetch("http://127.0.0.1:8000/api/tickets/");
    const data = await res.json();
    setTickets(data.results || data);
  };

  useEffect(() => {
    fetchTickets();
  }, [refresh]);

  return (
    <div>
      <h2>Tickets</h2>

      {tickets.map((t) => (
        <div key={t.id} style={{ border: "1px solid gray", margin: "10px", padding: "10px" }}>
          <h4>{t.title}</h4>
          <p>{t.description}</p>
          <p>Category: {t.category}</p>
          <p>Priority: {t.priority}</p>
          <p>Status: {t.status}</p>
        </div>
      ))}
    </div>
  );
}

export default TicketList;