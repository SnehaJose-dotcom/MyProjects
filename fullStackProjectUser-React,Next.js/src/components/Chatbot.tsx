// File: src/components/Chatbot.tsx
"use client";

import React, { useState } from "react";

type Message = {
  sender: "user" | "bot";
  text: string;
  imageUrl?: string;
};

const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { sender: "user", text: input };
    const updatedMessages: Message[] = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      const botMessage: Message = {
        sender: "bot",
        text: data.response,
        imageUrl: data.imageUrl,
      };
      setMessages([...updatedMessages, botMessage]);
    } catch (err) {
      const errorMessage: Message = { sender: "bot", text: "Something went wrong." };
      setMessages([...updatedMessages, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-[#fefdf6] shadow-lg rounded-lg border border-[#e6e3da]">
      <h2 className="text-2xl font-bold mb-4">Chatbot</h2>
      <div className="max-h-[400px] overflow-y-auto border rounded-md p-3 mb-4 bg-[#fcfcf8]">
        {messages.map((msg, idx) => (
          <div key={idx} className={`mb-4 ${msg.sender === "user" ? "text-right" : "text-left"}`}>
            <span className={`inline-block px-3 py-2 rounded-lg max-w-[80%] ${msg.sender === "user" ? "bg-blue-100" : "bg-gray-200"}`}>
              {msg.text}
            </span>
            {msg.imageUrl && (
              <div className="mt-2">
                <img src={msg.imageUrl} alt="Response image" className="rounded w-40 h-auto mx-auto" />
              </div>
            )}
          </div>
        ))}
        {loading && <p className="text-sm text-gray-400">Bot is typing...</p>}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 border rounded px-3 py-2"
          placeholder="Ask about refunds, products, support..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
