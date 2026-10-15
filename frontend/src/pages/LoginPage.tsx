import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { TrendingUp, Lock, User, ArrowLeft, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { AlertBanner } from '../components/common/AlertBanner';
import { getApiErrorMessage } from '../api/client';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // If redirected from registration with success state
  const registrationSuccessMessage = location.state?.registeredMessage;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedIdentifier = identifier.trim();
    if (!trimmedIdentifier) {
      setErrorMessage('Please enter your email or username.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsLoading(true);
    try {
      // Backend checks: $or: [{ email }, { userName }]
      const isEmail = /^\S+@\S+\.\S+$/.test(trimmedIdentifier);
      await login({
        email: isEmail ? trimmedIdentifier : undefined,
        userName: !isEmail ? trimmedIdentifier : undefined,
        password,
      });

      // Redirect to intended route or default to dashboard
      const from = (location.state as any)?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch (err) {
      setErrorMessage(getApiErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-slate-200 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <div className="flex items-center gap-3 justify-center mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-950">
            <TrendingUp className="w-6 h-6 stroke-[2.5]" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">
            Portfolio<span className="text-emerald-400">Matters</span>
          </span>
        </div>
        <h2 className="text-center text-xl font-semibold text-slate-200">
          Sign In to Your Dashboard
        </h2>
        <p className="mt-1 text-center text-xs text-slate-400">
          Access your holdings, analytics, and stock watchlists
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#0b101d] border border-slate-800 rounded-2xl py-8 px-6 sm:px-10 shadow-2xl space-y-6">
          {registrationSuccessMessage && (
            <AlertBanner
              type="success"
              title="Account Created"
              message={registrationSuccessMessage}
            />
          )}

          {errorMessage && (
            <AlertBanner
              type="error"
              title="Authentication Failed"
              message={errorMessage}
              onDismiss={() => setErrorMessage(null)}
            />
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Username or Email"
              type="text"
              placeholder="e.g. investor101 or user@example.com"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              autoFocus
              leftIcon={<User className="w-4 h-4" />}
            />

            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              leftIcon={<Lock className="w-4 h-4" />}
            />

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full"
                isLoading={isLoading}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Sign In
              </Button>
            </div>
          </form>

          <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
            Don't have an account yet?{' '}
            <Link
              to="/register"
              className="font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
