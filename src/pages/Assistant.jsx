import { useState } from "react";
import { Bot, Send, Loader2, User } from "lucide-react";
import api from "../api/apiClient";

export default function Assistant() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = {
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await api.post("/assistant/ask", {
        question: userMessage.content,
      });

      const data = res.data;

      // 1️⃣ رسالة المساعد (answer)
      if (data.answer) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.answer,
          },
        ]);
      }

      // 2️⃣ نتيجة الحساب (نختار مذهب واحد – الجمهور)
      if (data.results?.jumhur) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            result: data.results.jumhur,
          },
        ]);
      }
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "❌ حصل خطأ أثناء الحساب، حاول مرة أخرى",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-[80vh]">
      {/* Header */}
      <div className="card p-4 flex items-center gap-3 mb-4">
        <Bot />
        <div>
          <h1 className="text-xl font-bold">المساعد الذكي للميراث</h1>
          <p className="text-sm text-gray-600">
            اكتب مسألة الميراث وسأحسبها لك
          </p>
        </div>
      </div>

      {/* Chat */}
      <div className="flex-1 overflow-y-auto space-y-4 p-2">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-2xl p-4 text-sm whitespace-pre-line ${
                msg.role === "user"
                  ? "bg-gray-900 text-white"
                  : "bg-white border"
              }`}
            >
              {msg.role === "user" && (
                <div className="flex items-center gap-2 mb-2 font-bold">
                  <User size={16} /> أنت
                </div>
              )}

              {msg.role === "assistant" && (
                <div className="flex items-center gap-2 mb-2 font-bold">
                  <Bot size={16} /> المساعد
                </div>
              )}

              {/* نص عادي */}
              {msg.content && <div>{msg.content}</div>}

              {/* نتيجة الحساب */}
              {msg.result && (
                <div className="space-y-3 mt-2">
                  <div className="font-bold">
                    💰 إجمالي التركة:{" "}
                    {msg.result.totalEstate.toLocaleString()}
                  </div>

                  <div className="text-sm text-gray-600">
                    المذهب: {msg.result.madhhab}
                  </div>

                  {msg.result.shares.map((s, idx) => (
                    <div key={idx} className="border-t pt-2">
                      <div className="flex justify-between font-semibold">
                        <span>{s.heir}</span>
                        <span>
                          {(s.shareRatio * 100).toFixed(2)}% —{" "}
                          {s.amount.toLocaleString()}
                        </span>
                      </div>

                      {s.reason && (
                        <div className="text-xs text-gray-600 mt-1">
                          {s.reason}
                        </div>
                      )}

                      {s.note && (
                        <div className="text-amber-600 text-xs mt-1">
                          ⚠ {s.note}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Loader2 className="animate-spin" size={16} />
            المساعد يفكر...
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex gap-2 mt-4">
        <textarea
          className="flex-1 rounded-2xl border px-4 py-3 outline-none"
          placeholder="اكتب سؤالك هنا..."
          rows={2}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          onClick={sendMessage}
          className="btn-primary px-4"
          disabled={loading}
        >
          <Send />
        </button>
      </div>
    </div>
  );
}
