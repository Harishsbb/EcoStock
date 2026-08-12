import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Boxes, ArrowRight, ShieldCheck, Sparkles, AlertCircle } from "lucide-react";

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("owner@smartstock.com");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login({ email, password });
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col lg:flex-row text-slate-100 font-sans">
      {/* Left Visual Branding Panel */}
      <div className="lg:w-1/2 p-8 lg:p-16 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800 relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-xl shadow-emerald-500/20">
            <Boxes className="w-7 h-7 text-slate-950" />
          </div>
          <div>
            <h1 className="font-black text-2xl tracking-tight text-white">SmartStock</h1>
            <p className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">Intelligent Inventory SaaS</p>
          </div>
        </div>

        <div className="relative z-10 my-12 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <Sparkles className="w-4 h-4" /> AI-Powered Expiry & Demand Engine
          </div>
          <h2 className="text-3xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Predict demand. <br />
            Prevent waste. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
              Recover revenue.
            </span>
          </h2>
          <p className="text-slate-400 text-sm max-w-md leading-relaxed">
            SmartStock doesn't just tell you what's happening in your shop—it actively recommends optimal markdown discounts, reorders, and inter-shop exchanges.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <p className="text-2xl font-black text-emerald-400">₹8,420+</p>
              <p className="text-xs text-slate-400 mt-1">Avg. Monthly Waste Recovered</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <p className="text-2xl font-black text-teal-400">30%</p>
              <p className="text-xs text-slate-400 mt-1">Waste Reduction Rate</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-slate-500 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Enterprise-grade JWT Authentication & MERN Security</span>
        </div>
      </div>

      {/* Right Login Form Panel */}
      <div className="lg:w-1/2 p-8 lg:p-16 flex items-center justify-center bg-slate-950">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h3 className="text-2xl font-extrabold text-white">Welcome back 👋</h3>
            <p className="text-slate-400 text-sm mt-1">Sign in to manage your inventory and store analytics.</p>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm flex items-center gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Demo Login Preset Buttons */}
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Demo Quick Sign-In:</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setEmail("owner@smartstock.com");
                  setPassword("password123");
                }}
                className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold hover:bg-emerald-500/20"
              >
                Owner Demo
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail("staff@smartstock.com");
                  setPassword("password123");
                }}
                className="px-3 py-1.5 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/30 text-xs font-semibold hover:bg-sky-500/20"
              >
                Staff Demo
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-sm placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                placeholder="name@shop.com"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-slate-300 uppercase">Password</label>
                <a href="#" className="text-xs text-emerald-400 hover:text-emerald-300 font-medium">
                  Forgot password?
                </a>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-sm placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/25 hover:from-emerald-400 hover:to-teal-400 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              {loading ? (
                "Authenticating..."
              ) : (
                <>
                  <span>Sign In to SmartStock</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="text-center text-xs text-slate-400">
            Don't have a shop account?{" "}
            <Link to="/register" className="text-emerald-400 font-semibold hover:text-emerald-300">
              Register Shop Owner Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
