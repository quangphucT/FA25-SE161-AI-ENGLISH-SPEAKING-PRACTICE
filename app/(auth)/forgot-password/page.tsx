
"use client";
import { useState } from "react";

const Page = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // TODO: Call API to send reset email
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#16232d]">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md mx-auto flex flex-col items-center gap-6 px-6 py-10 rounded-xl"
      >
        <h1 className="text-3xl font-bold text-white text-center mb-2">Quên mật khẩu</h1>
        <p className="text-lg text-[#cbe7ff] text-center mb-4">
          Chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu<br />của bạn qua email.
        </p>
        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full bg-[#22313f] text-white text-lg px-4 py-3 rounded-lg border border-[#3a4a5a] focus:outline-none focus:border-[#4fc3f7] mb-2"
        />
        <button
          type="submit"
          className="w-full bg-[#4fc3f7] text-[#16232d] text-lg font-bold py-3 rounded-xl shadow hover:bg-[#29b6f6] transition mb-2"
        >
          Gửi
        </button>
        {submitted && (
          <div className="text-green-400 text-center text-sm mt-2">Đã gửi email hướng dẫn đặt lại mật khẩu!</div>
        )}
      </form>
    </div>
  );
}

export default Page
