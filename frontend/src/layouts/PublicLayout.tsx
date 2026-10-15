import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { TrendingUp, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const PublicLayout: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* Public Navbar */}
      <header className="sticky top-0 z-40 bg-[#070b14]/90 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-950/50 group-hover:scale-105 transition-transform">
              <TrendingUp className="w-5 h-5 stroke-[2.5]" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">
              Portfolio<span className="text-emerald-400">Matters</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#features" className="hover:text-slate-100 transition-colors">
              Features
            </a>
            <a href="#preview" className="hover:text-slate-100 transition-colors">
              Dashboard Preview
            </a>
            <a href="#analytics" className="hover:text-slate-100 transition-colors">
              Analytics & Risk
            </a>
          </nav>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition-all shadow-sm shadow-emerald-950"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition-all shadow-sm shadow-emerald-950"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Outlet */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#090d18] text-slate-400 text-xs py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <span className="font-bold text-slate-200 text-sm">Portfolio Matters</span>
              </div>
              <p className="text-slate-500 leading-relaxed text-xs">
                Disciplined stock portfolio tracking, risk analysis, and diversification simulation built for modern retail investors.
              </p>
            </div>

            <div>
              <h4 className="text-slate-200 font-semibold mb-3">Application</h4>
              <ul className="space-y-2">
                <li><Link to="/dashboard" className="hover:text-slate-300">Dashboard</Link></li>
                <li><Link to="/portfolio" className="hover:text-slate-300">My Portfolio</Link></li>
                <li><Link to="/stocks" className="hover:text-slate-300">Explore Stocks</Link></li>
                <li><Link to="/analytics" className="hover:text-slate-300">Risk & Simulation</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-slate-200 font-semibold mb-3">Security & Compliance</h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-1.5 text-slate-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>JWT Protected Routes</span>
                </li>
                <li><span>Bcrypt Password Encryption</span></li>
                <li><span>Automated Snapshot Cron</span></li>
                <li><span>Active Price Alert Verification</span></li>
              </ul>
            </div>

            <div>
              <h4 className="text-slate-200 font-semibold mb-3">Financial Disclosure</h4>
              <p className="text-slate-500 leading-relaxed text-[11px]">
                Portfolio Matters is an analytical tracking dashboard designed for portfolio visibility. It does not provide automated trading, brokerage execution, or financial advice. All hypothetical simulations are illustrative only.
              </p>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-slate-500 gap-4">
            <p>© {new Date().getFullYear()} Portfolio Matters. All rights reserved.</p>
            <p className="text-[11px]">Engineered with React, TypeScript, Express, and MongoDB.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
