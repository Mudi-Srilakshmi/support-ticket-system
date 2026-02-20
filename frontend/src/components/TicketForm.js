import { useState } from "react";

function TicketForm({ onTicketCreated }) {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("");

  // 🔹 LLM classify
  const classifyTicket = async () => {
    if (!description) return;

    try {
      const res = await fetch("http://127.0.0.1:8000/api/tickets/classify/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ description }),
      });

      const data = await res.json();

      setCategory(data.suggested_category);
      setPriority(data.suggested_priority);

    } catch (err) {
      console.log(err);
    }
  };

  // 🔹 Submit ticket
  const submitTicket = async () => {
    if (!title || !description) {
      alert("Title and Description required");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/api/tickets/", {
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

      if (res.ok) {
        alert("Ticket Created");

        setTitle("");
        setDescription("");
        setCategory("");
        setPriority("");

        onTicketCreated(); // 🔥 refresh list + stats
      }

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
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
        onChange={(e) => setDescription(e.target.value)}
        onBlur={classifyTicket}
      />

      <br /><br />

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
    </div>
  );
}

export default TicketForm;