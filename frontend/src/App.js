import { useState, useEffect } from "react";

function App() {

  // -------------------------------
  // FORM STATE
  // -------------------------------
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("");
  const [loading, setLoading] = useState(false);

  // -------------------------------
  // TICKETS LIST
  // -------------------------------
  const [tickets, setTickets] = useState([]);

  // -------------------------------
  // STATS
  // -------------------------------
  const [stats, setStats] = useState(null);

  // -------------------------------
  // FETCH TICKETS
  // -------------------------------
  const fetchTickets = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/tickets/");
      const data = await res.json();

      // pagination safe
      setTickets(data.results || data);
    } catch (err) {
      console.log(err);
    }
  };

  // -------------------------------
  // FETCH STATS
  // -------------------------------
  const fetchStats = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/tickets/stats/");
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.log(err);
    }
  };

  // -------------------------------
  // LOAD DATA ON START
  // -------------------------------
  useEffect(() => {
    fetchTickets();
    fetchStats();
  }, []);

  // -------------------------------
  // LLM CLASSIFY
  // -------------------------------
  const classifyTicket = async (desc) => {
    if (!desc) return;

    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/tickets/classify/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ description: desc }),
      });

      const data = await response.json();

      if (data.suggested_category) {
        setCategory(data.suggested_category);
      }

      if (data.suggested_priority) {
        setPriority(data.suggested_priority);
      }

    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  // -------------------------------
  // SUBMIT TICKET
  // -------------------------------
  const submitTicket = async () => {
    if (!title || !description) {
      alert("Title and Description required");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/tickets/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          category,
          priority,
        }),
      });

      if (response.ok) {
        alert("Ticket Created ✅");

        // clear form
        setTitle("");
        setDescription("");
        setCategory("");
        setPriority("");

        // refresh data
        fetchTickets();
        fetchStats();
      } else {
        alert("Error creating ticket");
      }

    } catch (error) {
      console.log(error);
    }
  };

  // -------------------------------
  // UPDATE STATUS (PATCH)
  // -------------------------------
  const updateStatus = async (id, newStatus) => {
    try {
      await fetch(`http://127.0.0.1:8000/api/tickets/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      fetchTickets();
      fetchStats();

    } catch (err) {
      console.log(err);
    }
  };

  // -------------------------------
  // UI
  // -------------------------------
  return (
    <div style={{ padding: "20px" }}>

      <h1>Support Ticket System</h1>

      {/* ================= FORM ================= */}
      <h2>Create Ticket</h2>

      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <br /><br />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => {
          const value = e.target.value;
          setDescription(value);

          if (value.length > 10) {
            classifyTicket(value);
          }
        }}
      />

      <br />

      {loading && <p>🔄 Getting AI suggestions...</p>}

      <br />

      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">Select Category</option>
        <option value="billing">Billing</option>
        <option value="technical">Technical</option>
        <option value="account">Account</option>
        <option value="general">General</option>
      </select>

      <br /><br />

      <select value={priority} onChange={(e) => setPriority(e.target.value)}>
        <option value="">Select Priority</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
        <option value="critical">Critical</option>
      </select>

      <br /><br />

      <button onClick={submitTicket}>Submit Ticket</button>

      <hr />

      {/* ================= STATS ================= */}
      <h2>Stats</h2>

      {stats ? (
        <div>
          <p>Total: {stats.total_tickets}</p>
          <p>Open: {stats.open_tickets}</p>
          <p>Avg/day: {stats.avg_tickets_per_day}</p>
        </div>
      ) : (
        <p>Loading stats...</p>
      )}

      <hr />

      {/* ================= TICKET LIST ================= */}
      <h2>Tickets</h2>

      {tickets.map((t) => (
        <div key={t.id} style={{ border: "1px solid gray", margin: "10px", padding: "10px" }}>
          <h4>{t.title}</h4>
          <p>{t.description}</p>
          <p>Category: {t.category}</p>
          <p>Priority: {t.priority}</p>

          <p>Status: {t.status}</p>

          {/* change status */}
          <select onChange={(e) => updateStatus(t.id, e.target.value)}>
            <option value="">Change Status</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      ))}

    </div>
  );
}

export default App;