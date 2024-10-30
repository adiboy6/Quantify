import React, { useState } from 'react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [touched, setTouched] = useState({
    email: false,
    password: false
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBlur = (field) => {
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mark all fields as touched on submit attempt
    setTouched({
      email: true,
      password: true
    });
    
    if (formData.email && formData.password) {
      // Proceed with login
      console.log('Form submitted:', formData);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
          Welcome Back!
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Log in to your account to continue.
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={() => handleBlur('email')}
              placeholder="Enter your email" 
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                touched.email && !formData.email ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {touched.email && !formData.email && (
              <p className="text-red-500 text-sm mt-1">Please enter your email address</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Password <span className="text-red-500">*</span>
            </label>
            <input 
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={() => handleBlur('password')}
              placeholder="Enter your password" 
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                touched.password && !formData.password ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {touched.password && !formData.password && (
              <p className="text-red-500 text-sm mt-1">Please enter your password</p>
            )}
          </div>

          <div className="text-right">
            <a href="/forgot-password" className="text-sm text-blue-500 hover:underline">
              Forgot your password?
            </a>
          </div>

          <button 
            type="submit" 
            className="w-full py-3 bg-blue-500 text-white font-bold text-lg rounded-lg shadow hover:bg-blue-600 transition duration-300"
          >
            Log In
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Don't have an account? <a href="/create-account" className="text-blue-500 hover:underline">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;