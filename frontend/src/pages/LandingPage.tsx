import React from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  Shield,
  PieChart as PieIcon,
  Bell,
  Sliders,
  Search,
  ArrowRight,
  CheckCircle2,
  DollarSign,
  Activity,
} from 'lucide-react';
import { StatCard } from '../components/common/StatCard';
import { Badge } from '../components/common/Badge';

export const LandingPage: React.FC = () => {
  return (
    <div className="space-y-24 py-12 md:py-20">
      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-4 text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/30 text-emerald-400 text-xs font-semibold">
          <Activity className="w-3.5 h-3.5" />
          <span>Professional Investment Tracking & Analysis</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
          Make Smarter Investment Decisions with{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
            Portfolio Matters
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-base md:text-lg text-slate-300 leading-relaxed">
          A disciplined stock portfolio analytics platform. Track your holdings, monitor sector concentration, configure price alerts, and run hypothetical market stress tests.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            to="/register"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-all shadow-lg shadow-emerald-950/60"
          >
            <span>Start Tracking Free</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/login"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-sm transition-all"
          >
            <span>Existing User Sign In</span>
          </Link>
        </div>

        {/* Feature Pills */}
        <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Real-time NSE Integration
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Sector Allocation Modeling
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Automated Price Watchdogs
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Zero Unrealistic Promises
          </span>
        </div>
      </section>

      {/* Dashboard Preview Section (Built with genuine UI components) */}
      <section id="preview" className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <Badge variant="purple" size="md" className="mb-2">Product Preview</Badge>
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Designed for Clarity, Speed, and Focus
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            An illustrative snapshot of the unified analytics dashboard.
          </p>
        </div>

        <div className="bg-[#0b101d] border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
          {/* Subtle glow */}
          <div className="absolute -top-32 -left-32 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Sample Top Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
              title="Current Value"
              value="₹3,45,280.00"
              subValue="Invested: ₹3,10,000.00"
              changePercent={11.38}
              icon={<DollarSign className="w-5 h-5 text-emerald-400" />}
            />
            <StatCard
              title="Total Returns"
              value="₹35,280.00"
              subValue="Realized + Unrealized"
              changePercent={11.38}
              icon={<TrendingUp className="w-5 h-5 text-emerald-400" />}
            />
            <StatCard
              title="Top Gainer"
              value="TATA MOTORS"
              subValue="+₹14,200.00 (+18.4%)"
              trendLabel="Automobile"
              icon={<Activity className="w-5 h-5 text-cyan-400" />}
            />
            <StatCard
              title="Diversification Score"
              value="78 / 100"
              subValue="Low Risk (Balanced)"
              trendLabel="HHI Index"
              icon={<PieIcon className="w-5 h-5 text-purple-400" />}
            />
          </div>

          {/* Sample Mini Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase text-slate-400">Sector Weighting Preview</span>
                <span className="text-xs text-slate-500">4 Sectors Active</span>
              </div>
              <div className="space-y-2.5">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300 font-medium">Information Technology</span>
                    <span className="text-slate-400 font-mono">42.5%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '42.5%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300 font-medium">Financial Services</span>
                    <span className="text-slate-400 font-mono">31.0%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '31.0%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300 font-medium">Automobile</span>
                    <span className="text-slate-400 font-mono">18.5%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: '18.5%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase text-slate-400">Active Price Alerts</span>
                <Badge variant="success" size="sm">Cron Monitoring</Badge>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2.5 bg-slate-850 rounded-lg border border-slate-800">
                  <div>
                    <p className="text-xs font-semibold text-slate-200">INFY (Infosys Ltd)</p>
                    <p className="text-[11px] text-slate-400">Target: Above ₹1,850.00</p>
                  </div>
                  <Badge variant="warning" size="sm">Active</Badge>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-slate-850 rounded-lg border border-slate-800">
                  <div>
                    <p className="text-xs font-semibold text-slate-200">RELIANCE (Reliance Ind.)</p>
                    <p className="text-[11px] text-slate-400">Target: Below ₹2,700.00</p>
                  </div>
                  <Badge variant="info" size="sm">Monitoring</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Capabilities */}
      <section id="features" className="max-w-6xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-white tracking-tight">
            Engineered for Modern Portfolio Hygiene
          </h2>
          <p className="text-slate-400 text-sm mt-3">
            Core analytical tools built to provide complete visibility over your equity investments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#0b101d] border border-slate-800 hover:border-slate-700 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-5">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-slate-100 mb-2">Portfolio Tracking</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Real-time calculation of overall portfolio valuation, invested capital, net profit or loss, and weighted average acquisition prices.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0b101d] border border-slate-800 hover:border-slate-700 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-blue-950/60 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-5">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-slate-100 mb-2">Stock Exploration</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Explore actively tracked NSE stocks with instant search by company name, sector classification, and pagination.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0b101d] border border-slate-800 hover:border-slate-700 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-5">
              <PieIcon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-slate-100 mb-2">Sector Diversification</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Visualize equity allocation across industry sectors. Identify overweight concentrations and monitor portfolio risk distribution.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0b101d] border border-slate-800 hover:border-slate-700 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-amber-950/60 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-5">
              <Bell className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-slate-100 mb-2">Custom Price Watchdogs</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Define price alert conditions (above or below specified targets) with automated cron monitoring and email notifications.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0b101d] border border-slate-800 hover:border-slate-700 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-5">
              <Sliders className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-slate-100 mb-2">Hypothetical Simulation</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Simulate hypothetical market swings (-50% to +50%) and review Herfindahl-Hirschman Index (HHI) concentration scores.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0b101d] border border-slate-800 hover:border-slate-700 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 mb-5">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-slate-100 mb-2">Authenticated Security</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Secured with bcrypt password hashing, JSON Web Token authentication middleware, and validated request schemas.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="max-w-4xl mx-auto px-4 text-center">
        <div className="bg-gradient-to-b from-[#0e172a] to-[#0b101d] border border-slate-800 rounded-3xl p-8 md:p-12 shadow-2xl space-y-6">
          <h2 className="text-3xl font-bold text-white tracking-tight">
            Ready to Take Control of Your Portfolio?
          </h2>
          <p className="text-sm text-slate-400 max-w-lg mx-auto">
            Create your account today and start tracking your stocks with clarity and precision.
          </p>
          <div className="pt-2">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-all shadow-lg shadow-emerald-950/60"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
