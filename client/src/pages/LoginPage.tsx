import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Boxes, ArrowRight, ShieldCheck, Sparkles, AlertCircle, TrendingUp, Leaf } from "lucide-react";

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
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row text-slate-900 font-sans">
      {/* Left Visual Branding Panel */}
      <div className="lg:w-1/2 p-8 lg:p-16 bg-gradient-to-br from-emerald-900 via-slate-900 to-teal-950 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-emerald-800/40 relative overflow-hidden text-white">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-xl shadow-emerald-500/20 text-slate-950 font-bold">
            <Boxes className="w-7 h-7" />
          </div>
          <div>
            <h1 className="font-black text-2xl tracking-tight text-white">SmartStock</h1>
            <p className="text-xs text-emerald-300 font-bold uppercase tracking-wider">Intelligent Inventory SaaS</p>
          </div>
        </div>

        <div className="relative z-10 my-12 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold backdrop-blur-md">
            <Sparkles className="w-4 h-4" /> AI-Powered Command & Expiry Engine
          </div>
          <h2 className="text-3xl lg:text-5xl font-black tracking-tight text-white leading-tight">
            Predict demand. <br />
            Prevent waste. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
              Recover lost revenue.
            </span>
          </h2>
          <p className="text-slate-300 text-sm max-w-md leading-relaxed">
            SmartStock turns static inventory management into an active command system with real-time markdown recommendations, stockout forecasting, and inter-shop B2B exchange.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="p-4 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-slate-700/80">
              <p className="text-2xl font-black text-emerald-400">₹8,420+</p>
              <p className="text-xs text-slate-300 font-medium mt-1">Avg. Monthly Waste Saved</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-slate-700/80">
              <p className="text-2xl font-black text-teal-300">28.4%</p>
              <p className="text-xs text-slate-300 font-medium mt-1">Waste Reduction Rate</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-slate-400 flex items-center gap-2 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Enterprise-grade JWT Authentication & MERN Infrastructure</span>
        </div>
      </div>

      {/* Right Login Form Panel */}
      <div className="lg:w-1/2 p-8 lg:p-16 flex items-center justify-center bg-white">
        <div className="w-full max-w-md space-y-8">
          <div>
            <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 uppercase">
              Retail Portal
            </span>
            <h3 className="text-2xl font-black text-slate-900 mt-2">Welcome back 👋</h3>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">Sign in to access your Store Command Center.</p>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Demo Sign-In Preset */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Demo One-Click Login:</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setEmail("owner@smartstock.com");
                  setPassword("password123");
                }}
                className="px-3.5 py-2 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-extrabold hover:bg-emerald-200 transition-colors"
              >
                Owner Demo
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail("staff@smartstock.com");
                  setPassword("password123");
                }}
                className="px-3.5 py-2 rounded-xl bg-sky-100 text-sky-800 border border-sky-200 text-xs font-extrabold hover:bg-sky-200 transition-colors"
              >
                Staff Demo
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase mb-1.5">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm placeholder:text-slate-400 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium"
                placeholder="name@shop.com"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-extrabold text-slate-700 uppercase">Password</label>
                <a href="#" className="text-xs text-emerald-700 hover:text-emerald-800 font-bold">
                  Forgot password?
                </a>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm placeholder:text-slate-400 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-emerald-600/20 hover:from-emerald-700 hover:to-teal-600 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                "Authenticating..."
              ) : (
                <>
                  <span>Sign In to SmartStock Command Center</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="text-center text-xs text-slate-500">
            Don't have a shop account?{" "}
            <Link to="/register" className="text-emerald-700 font-bold hover:underline">
              Register Shop Owner Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
