import { useState } from "react";

export default function ChatBox({ onSend }) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!message.trim()) return;
    if (onSend) onSend(message);
    setMessage("");
  };

  return (
    <div className="mt-4 border rounded p-2 bg-white">
      <h3 className="font-bold mb-2">Chat</h3>
      <div className="flex space-x-2">
        <input
          type="text"
          className="flex-grow border rounded px-2 py-1"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white px-3 py-1 rounded"
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </div>
  );
}
