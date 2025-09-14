"use client";
import { useState } from "react";
import { useLogin } from "@/hooks/useLogin";
import { LoginRequest } from "@/types/auth";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const { login, loading, error } = useLogin();
  const [form, setForm] = useState<LoginRequest>({ email: "", password: "" });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await login(form);
    if (res) {
      console.log("✅ Login success:", res);
      // Lưu token vào localStorage / cookie nếu cần
      localStorage.setItem("token", res.token);
      router.push("/");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-sm">
      <input
        type="text"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className="border p-2 rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        className="border p-2 rounded"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white py-2 rounded"
      >
        {loading ? "Logging in..." : "Login"}
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
}
