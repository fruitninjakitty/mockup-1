
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminRegisterForm } from "@/components/auth/AdminRegisterForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function AdminRegister() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F8F7FA] via-[#FFFFFF] to-[#E2F0FA]">
      <div className="w-full max-w-md p-6 animate-fade-in">
        <div className="card-gradient minimal-card border border-border">
          <div className="relative mb-8">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate("/")}
              className="absolute left-0 top-0"
              aria-label="Back to login"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold text-center" style={{ color: "#43BC88" }}>
              Register Your Institute
            </h1>
            <p className="text-gray-600 mt-2 text-center">
              Create an administrator account to manage your institute
            </p>
          </div>
          <AdminRegisterForm />
          <div className="mt-6 text-sm text-center text-muted-foreground">
            <p>After registration, share your school code with students and teachers to join your institution.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
