import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowLeft, Home } from 'lucide-react';
import { Button } from '../components/common/Button';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col items-center justify-center p-4 text-center">
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-amber-400 mb-6 shadow-xl">
        <AlertTriangle className="w-12 h-12" />
      </div>

      <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">
        404 — Page Not Found
      </h1>
      <p className="text-sm text-slate-400 max-w-md mb-8 leading-relaxed">
        The portfolio page or resource you requested does not exist or has been relocated.
      </p>

      <div className="flex items-center gap-3">
        <Link to="/">
          <Button variant="secondary" size="md" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to Home
          </Button>
        </Link>
        <Link to="/dashboard">
          <Button variant="primary" size="md" leftIcon={<Home className="w-4 h-4" />}>
            Go to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};
