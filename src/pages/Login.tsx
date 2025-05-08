
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { useAuth } from "@/context/AuthContext";

export default function Login() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  
  // Redirect to courses if already authenticated
  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate('/courses');
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F8F7FA] via-[#FFFFFF] to-[#E2F0FA]">
      <div className="w-full max-w-md p-6 animate-fade-in">
        <div className="card-gradient minimal-card border border-border">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold" style={{ color: "#43BC88" }}>
              Welcome to Gooru Labs navigated learning platform
            </h1>
          </div>
          <div className="mb-6">
            <div className="grid grid-cols-2 gap-2 bg-[#E6FAF0] p-1 rounded-lg">
              <button
                onClick={() => setActiveTab("login")}
                className={`py-2 rounded-full text-sm font-semibold transition-colors ${
                  activeTab === "login"
                    ? "bg-white shadow text-[#43BC88] border border-[#43BC88]"
                    : "text-[#518CCA] hover:text-[#43BC88]"
                }`}
                aria-label="Switch to Login tab"
                style={{
                  borderColor: activeTab === "login" ? "#43BC88" : "transparent",
                }}
              >
                Login
              </button>
              <button
                onClick={() => setActiveTab("register")}
                className={`py-2 rounded-full text-sm font-semibold transition-colors ${
                  activeTab === "register"
                    ? "bg-white shadow text-[#43BC88] border border-[#43BC88]"
                    : "text-[#518CCA] hover:text-[#43BC88]"
                }`}
                aria-label="Switch to Register tab"
                style={{
                  borderColor: activeTab === "register" ? "#43BC88" : "transparent",
                }}
              >
                Register
              </button>
            </div>
          </div>
          {activeTab === "login" ? <LoginForm /> : <RegisterForm />}
          
          <div className="text-center mt-6">
            <Link 
              to="/admin-register" 
              className="text-sm text-[#518CCA] hover:text-[#43BC88] hover:underline"
            >
              Want to sign up your institute with us? Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
