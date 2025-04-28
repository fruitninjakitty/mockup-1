
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminRegisterForm } from "@/components/auth/AdminRegisterForm";

export default function AdminRegister() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F8F7FA] via-[#FFFFFF] to-[#E2F0FA]">
      <div className="w-full max-w-md p-6 animate-fade-in">
        <div className="card-gradient minimal-card border border-border">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold" style={{ color: "#43BC88" }}>
              Register Your Institute
            </h1>
            <p className="text-gray-600 mt-2">
              Create an administrator account to manage your institute
            </p>
          </div>
          <AdminRegisterForm />
        </div>
      </div>
    </div>
  );
}
