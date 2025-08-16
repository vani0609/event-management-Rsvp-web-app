import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/events")
      .then(res => setEvents(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Upcoming Events</h1>
      <ul>
        {events.map(ev => (
          <li key={ev.id}>{ev.title} - {ev.date_time}</li>
        ))}
      </ul>
    </div>
  );
}
