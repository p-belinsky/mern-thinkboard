import { useState } from "react";
import { useNavigate, Navigate } from "react-router";
import { useAuthStore } from "../store/authStore";
import { Loader } from "lucide-react";
import { showToast } from "../lib/utils";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login, isLoading, isAuthenticated } = useAuthStore();
  if (isAuthenticated) return <Navigate to="/" replace />;

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/");
    } catch (error) {
      console.log("Error logging in:", error);
      showToast(error?.response?.data?.message || "Failed to log in");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="w-full max-w-md p-8 shadow-xl bg-base-100 rounded-box">
        <h1 className="text-3xl font-bold text-center text-primary mb-6">
          Welcome Back
        </h1>
        <form onSubmit={handleLogin} className="space-y-4">
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

          <button type="submit" className="btn btn-primary w-full">
            {isLoading ? (
              <Loader className="animate-spin mx-auto" size={24} />
            ) : (
              "Login"
            )}
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-base-content">
          Don't have an account?{" "}
          <a href="/signup" className="text-primary hover:underline">
            Sign up
          </a> or{" "}
              <a href="/verify-email" className="text-primary hover:underline">
            Verify here
          </a>
        </p>

      </div>
    </div>
  );
};

export default LoginPage;
