import React from "react";
import { PlusIcon, LogOutIcon } from 'lucide-react';
import { Link, useNavigate } from "react-router";
import { useAuthStore } from "../store/authStore";

const Navbar = () => {
  const navigate = useNavigate();
  const {logout} = useAuthStore();
  const handleLogout = () => {

    logout();
    navigate("/login");

  }

  return (
    <header className="bg-base-300 border-b border-base-content/10">
      <div className="mx-auto max-w-6xl p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-primary font-mono tracking-tight">
            ThinkBoard
          </h1>
          <div className="flex items-center gap-4">
            <Link to={"/create"} className="btn btn-primary">
            <PlusIcon className="size-5" />
            <span>New Note</span>
            </Link>
              <button onClick={handleLogout} className="btn btn-ghost text-green-500">
                <LogOutIcon className="size-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>

          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
