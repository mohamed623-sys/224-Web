import React, { useState } from "react";
import axios from "axios";

const backend = import.meta.env.VITE_BACKEND_URL || "https://224-api.vercel.app";

export default function CustomOrders() {
  const [form, setForm] = useState({ name: "", email: "", details: "" });
  const [status, setStatus] = useState(null);

  async function submit(e) {
    e.preventDefault();
    setStatus("sending");
    try {
      await axios.post(`${backend}/api/contact`, form);
      setStatus("sent");
      setForm({ name: "", email: "", details: "" });
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }

  return (
    <main className="min-h-screen bg-[url('/assets/galaxy-bg.jpg')] bg-cover bg-center text-white flex flex-col items-center justify-center p-8">
      <h2 className="text-4xl font-bold mb-6 text-center">
        Custom Orders – 224 ✦ Today, Tomorrow, Forever
      </h2>
      <form
        onSubmit={submit}
        className="bg-black/70 p-8 rounded-2xl w-full max-w-lg shadow-xl space-y-4"
      >
        <input
          className="w-full p-3 rounded bg-gray-900 text-white placeholder-gray-400"
          placeholder="Your name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          className="w-full p-3 rounded bg-gray-900 text-white placeholder-gray-400"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <textarea
          className="w-full p-3 rounded bg-gray-900 text-white placeholder-gray-400 min-h-[120px]"
          placeholder="Details about your custom order"
          value={form.details}
          onChange={(e) => setForm({ ...form, details: e.target.value })}
          required
        />
        <div className="flex justify-center">
          <button
            className="bg-purple-600 hover:bg-purple-800 px-8 py-3 rounded-lg font-semibold transition"
            type="submit"
          >
            {status === "sending" ? "Sending..." : "Send Request"}
          </button>
        </div>

        {status === "sent" && (
          <div className="text-green-400 text-center mt-3">
            ✅ Request sent — we’ll contact you soon.
          </div>
        )}
        {status === "error" && (
          <div className="text-red-400 text-center mt-3">
            ❌ Failed to send. Please try again later.
          </div>
        )}
      </form>
    </main>
  );
}
