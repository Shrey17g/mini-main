import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PawPrint, ArrowLeft } from 'lucide-react';

type UserType = 'customer' | 'center' | 'admin';

export default function Login() {
  const [userType, setUserType] = useState<UserType>('customer');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('userType', userType);
    navigate(`/${userType}Dashboard`);
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    alert('If an account exists with this email, you will receive password reset instructions.');
    setShowForgotPassword(false);
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('Attempting admin login...');
      const response = await fetch('http://localhost/mini%20main/project/src/backend/Login.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('Login response:', data);
      
      if (data.success) {
        console.log('Login successful, redirecting...');
        localStorage.setItem('adminId', data.admin_id);
        localStorage.setItem('userType', 'admin'); // Add this line
        navigate('/AdminDashboard', { replace: true }); // Add replace: true
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Connection error. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-100 to-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-8"
        >
          <ArrowLeft size={20} />
          Back to Home
        </button>

        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <PawPrint className="h-12 w-12 text-indigo-600" />
            <span className="text-4xl font-bold text-gray-900">PawsConnect</span>
          </div>
        </div>

        <div className="max-w-xl mx-auto">
          {!showForgotPassword ? (
            <div className="bg-white rounded-xl shadow-xl p-10">
              <div className="flex gap-2 mb-10">
                <button
                  className={`flex-1 py-4 rounded-lg font-semibold transition-all duration-200
                    ${userType === 'customer' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                  onClick={() => setUserType('customer')}
                >
                  Customer
                </button>
                <button
                  className={`flex-1 py-4 rounded-lg font-semibold transition-all duration-200
                    ${userType === 'center' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                  onClick={() => setUserType('center')}
                >
                  Adoption Center
                </button>
                <button
                  className={`flex-1 py-4 rounded-lg font-semibold transition-all duration-200
                    ${userType === 'admin' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                  onClick={() => setUserType('admin')}
                >
                  Admin
                </button>
              </div>

              <div className="flex gap-4 mb-10">
                <button
                  className={`flex-1 py-3 rounded-lg font-semibold transition-all duration-200
                    ${isLogin ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-600'}`}
                  onClick={() => setIsLogin(true)}
                >
                  Login
                </button>
                {userType !== 'admin' && (
                  <button
                    className={`flex-1 py-3 rounded-lg font-semibold transition-all duration-200
                      ${!isLogin ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-600'}`}
                    onClick={() => setIsLogin(false)}
                  >
                    Sign Up
                  </button>
                )}
              </div>

              <form onSubmit={userType === 'admin' && isLogin ? handleAdminLogin : handleSubmit} className="space-y-6">
                {!isLogin && userType !== 'admin' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {userType === 'center' ? 'Center Name' : 'Full Name'}
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder={userType === 'center' ? 'Enter center name' : 'Enter your full name'}
                        required
                      />
                    </div>

                    {userType === 'center' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          License Number
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="Enter adoption center license"
                          required
                        />
                      </div>
                    )}
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter your password"
                    required
                  />
                </div>

                {isLogin && userType !== 'admin' && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-sm text-indigo-600 hover:text-indigo-700"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                {error && <div className="text-red-500">{error}</div>}

                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-4 rounded-lg hover:bg-indigo-700 transition duration-200 font-semibold text-lg"
                >
                  {isLogin ? 'Login' : 'Sign Up'}
                </button>
              </form>

              {isLogin && userType !== 'admin' ? (
                <p className="mt-6 text-center text-gray-600">
                  Don't have an account?{' '}
                  <button
                    onClick={() => setIsLogin(false)}
                    className="text-indigo-600 font-semibold hover:text-indigo-700"
                  >
                    Sign up here
                  </button>
                </p>
              ) : userType !== 'admin' && (
                <p className="mt-6 text-center text-gray-600">
                  Already have an account?{' '}
                  <button
                    onClick={() => setIsLogin(true)}
                    className="text-indigo-600 font-semibold hover:text-indigo-700"
                  >
                    Login here
                  </button>
                </p>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-xl p-10">
              <h2 className="text-2xl font-bold mb-6">Reset Password</h2>
              <form onSubmit={handleForgotPassword} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-4 rounded-lg hover:bg-indigo-700 transition duration-200 font-semibold text-lg"
                >
                  Send Reset Instructions
                </button>

                <button
                  type="button"
                  onClick={() => setShowForgotPassword(false)}
                  className="w-full bg-gray-100 text-gray-700 py-4 rounded-lg hover:bg-gray-200 transition duration-200 font-semibold text-lg"
                >
                  Back to Login
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}