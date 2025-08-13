import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Send } from 'lucide-react';
import { chatWithAI } from '../services/aiService';

function Chatbot() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hello! I'm your AI assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await chatWithAI(updatedMessages);
      const aiMessage = response.choices[0].message;
      setMessages([...updatedMessages, aiMessage]);
    } catch (err) {
      console.error(err);
      setMessages([...updatedMessages, { role: 'assistant', content: 'Something went wrong. Please try again later.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px]">
      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={msg.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
            <div
              className={
                msg.role === 'user'
                  ? 'max-w-[80%] rounded-lg p-4 bg-indigo-600 text-white'
                  : 'max-w-[80%] rounded-lg p-4 bg-gray-100 text-gray-900'
              }
            >
            <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
          </div>
        ))}
        {loading && <p className="text-gray-500 italic">Thinking...</p>}
      </div>

      <form onSubmit={handleSubmit} className="border-t p-4">
        <div className="flex space-x-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
             className="flex-1 px-4 py-2 border rounded-lg bg-white text-gray-900 placeholder-gray-400 border-gray-300
              dark:bg-gray-900 dark:text-white dark:placeholder-gray-500 dark:border-gray-700
              focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center space-x-2"
          >
            <Send className="h-5 w-5" />
            <span>Send</span>
          </button>
        </div>
      </form>
    </div>
  );
}

export default Chatbot;
