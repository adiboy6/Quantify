import React from 'react';

function CreateAccount() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
          Let's get you started.
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Create an account to explore more opportunities.
        </p>

        <form className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">Full Name</label>
            <input 
              type="text" 
              placeholder="Enter your full name" 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">Email Address</label>
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">Password</label>
            <input 
              type="password" 
              placeholder="Enter your password" 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button 
            type="submit" 
            className="w-full py-3 bg-blue-500 text-white font-bold text-lg rounded-lg shadow hover:bg-blue-600 transition duration-300"
          >
            Create Account
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Already have an account? <a href="/login" className="text-blue-500 hover:underline">Log in</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default CreateAccount;
