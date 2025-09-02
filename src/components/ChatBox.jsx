import React, { useState } from "react";

export default function ChatBox() {
  const [text, setText] = useState("");
  const [msgs, setMsgs] = useState([{ id: 1, from: "System", body: "Welcome!" }]);

  const send = () => {
    if (!text.trim()) return;
    setMsgs(m => [...m, { id: Date.now(), from: "You", body: text }]);
    setText("");
  };

  return (
    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 h-[380px] flex flex-col">
      <div className="font-semibold mb-2">Chat</div>
      <div className="flex-1 overflow-auto space-y-2 text-sm">
        {msgs.map(m => (
          <div key={m.id}>
            <span className="text-gray-400 mr-2">{m.from}:</span>
            <span>{m.body}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          className="flex-1 bg-white/10 border border-white/10 rounded px-3 py-2"
          placeholder="Type message…"
        />
        <button onClick={send} className="px-3 py-2 rounded bg-sky-500 hover:bg-sky-600">
          Send
        </button>
      </div>
    </div>
  );
}
