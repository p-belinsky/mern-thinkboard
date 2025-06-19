import { useState } from "react";
import { useNavigate, Navigate } from "react-router";
import { useAuthStore } from "../store/authStore";
import { Loader } from 'lucide-react'
import { showToast } from "../lib/utils";

const SignUpPage = () => {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const {signup, isLoading, isAuthenticated} = useAuthStore();
    if(isAuthenticated) return <Navigate to="/" replace />


  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await signup(email, password, name);
      navigate('/verify-email');
    } catch (error) {
      console.log('Error signing up:', error);
      showToast(error?.response?.data?.message || 'Failed to sign up');
    }
  }


  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="w-full max-w-md p-8 shadow-xl bg-base-100 rounded-box">
        <h1 className="text-3xl font-bold text-center text-primary mb-6">
          Create an Account
        </h1>
        <form onSubmit={handleSignUp} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Full Name</span>
            </label>
            <input
              type="text"
              placeholder="Enter your full name"
              className="input input-bordered w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              placeholder="email@example.com"
              className="input input-bordered w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              placeholder="********"
              className="input input-bordered w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>


          <button disabled={isLoading} type="submit" className="btn btn-primary w-full">
            {isLoading ? <Loader className='animate-spin mx-auto' size={24} /> : "Sign Up"}
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-base-content">
          Already have an account?{" "}
          <a href="/login" className="text-primary hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
