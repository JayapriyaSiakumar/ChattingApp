import { useState } from "react";
import LoginForm from "../components/Auth/LoginForm";
import RegisterForm from "../components/Auth/RegisterForm";

export default function AuthPage() {
  const [mode, setMode] = useState("login");

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 sm:px-6">
      {" "}
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
      </div>
      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-sky-500/10 border border-sky-500/20 rounded-2xl mb-4">
            <span className="text-3xl">💬</span>
          </div>
          <h1 className="text-2xl font-bold text-white">ChatApp</h1>
          <p className="text-slate-400 text-sm mt-1">
            Connect and chat in real time
          </p>
        </div>

        {/* Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
          {/* Tabs */}
          <div className="flex bg-slate-950 rounded-xl p-1 mb-8">
            <button
              onClick={() => setMode("login")}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                mode === "login"
                  ? "bg-sky-500 text-white shadow-lg shadow-sky-500/25"
                  : "text-slate-400 hover:text-slate-200"
              }`}>
              Sign In
            </button>
            <button
              onClick={() => setMode("register")}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                mode === "register"
                  ? "bg-sky-500 text-white shadow-lg shadow-sky-500/25"
                  : "text-slate-400 hover:text-slate-200"
              }`}>
              Sign Up
            </button>
          </div>

          {mode === "login" ? (
            <LoginForm />
          ) : (
            <RegisterForm onSuccess={() => setMode("login")} />
          )}
        </div>
      </div>
    </div>
  );
}
