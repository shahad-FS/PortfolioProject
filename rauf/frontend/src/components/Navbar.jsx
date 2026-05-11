import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const { tokens, logout, user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);

  // أول حرفين من الاسم
  const getInitials = () => {
    if (!user?.full_name) return "U";

    return user.full_name
      .split(" ")
      .slice(0, 2)
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="navbar bg-base-100 shadow px-6">
      {/* Logo */}
      <div className="flex-1">
        <Link to="/" className="text-xl font-bold">
          rauf
        </Link>
      </div>

      {/* Center */}
      <div className="hidden md:flex gap-2">
        <Link to="/" className="btn btn-ghost btn-sm">
          Home
        </Link>

        <Link
          to={tokens ? "/book-appointment" : "/login"}
          className="btn btn-primary btn-sm"
        >
          Book
        </Link>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {!tokens ? (
          <>
            <Link to="/register" className="btn btn-outline btn-sm">
              Register
            </Link>
            <Link to="/login" className="btn btn-primary btn-sm">
              Login
            </Link>
          </>
        ) : (
          <div className="relative">
            {/* Avatar */}
            <button
              onClick={() => setOpen(!open)}
              className="btn btn-circle btn-sm bg-primary text-white"
            >
              {getInitials()}
            </button>

            {/* Dropdown */}
            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-xl p-2 z-50"
                >
                  <Link
                    to="/profile"
                    className="block px-3 py-2 rounded hover:bg-gray-100"
                  >
                    Profile
                  </Link>

                  <button
                    onClick={logout}
                    className="w-full text-left px-3 py-2 rounded hover:bg-red-50 text-red-500"
                  >
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
