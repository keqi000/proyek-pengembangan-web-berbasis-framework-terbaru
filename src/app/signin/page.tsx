"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLoginMutation } from "../admin/_hook/auth";

export default function SignInPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const loginMutation = useLoginMutation();
  const router = useRouter();

  const handleLogin = () => {
    if (!username || !password) {
      setError("Username dan password harus diisi!");
      return;
    }

    setIsLoading(true);
    setError("");

    loginMutation.mutate(
      {
        username: username.trim(),
        password: password,
      },
      {
        onSuccess: (data) => {
          console.log("Login success:", data);

          // Cek apakah response berhasil dan ada data user
          if (data && data.message === "success" && data.data) {
            // Simpan data user ke localStorage
            localStorage.setItem("user", JSON.stringify(data.data));
            localStorage.setItem("userRole", data.data.role);
            localStorage.setItem("isAuthenticated", "true");

            // Redirect berdasarkan role yang tepat
            const userRole = data.data.role;
            console.log("User role:", userRole);

            switch (userRole) {
              case "admin":
                console.log("Redirecting to admin dashboard");
                router.push("/admin/home");
                break;
              case "dosen":
                console.log("Redirecting to dosen dashboard");
                router.push("/dosen/home");
                break;
              case "mahasiswa":
                console.log("Redirecting to mahasiswa dashboard");
                router.push("/user/home");
                break;
              default:
                console.log("Unknown role, redirecting to default");
                setError("Role pengguna tidak dikenali");
                setIsLoading(false);
                return;
            }
          } else {
            setError("Response login tidak valid");
            setIsLoading(false);
          }
        },
        onError: (error: any) => {
          console.error("Login error:", error);

          // Handle different types of errors
          if (error?.response?.status === 401) {
            setError("Username atau password salah!");
          } else if (error?.response?.status === 422) {
            setError("Data yang dimasukkan tidak valid!");
          } else if (error?.response?.status >= 500) {
            setError("Terjadi kesalahan server. Silakan coba lagi.");
          } else {
            setError("Terjadi kesalahan. Silakan coba lagi.");
          }

          setIsLoading(false);
        },
      }
    );
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[url('/background-login.jpg')] bg-cover bg-center opacity-20"></div>

      {/* Card Container */}
      <div className="relative bg-white shadow-lg rounded-xl m-8 md:m-0 p-8 md:p-12 w-full max-w-3xl border border-gray-200 flex flex-col items-center">
        {/* Title */}
        <h2 className="text-center text-lg md:text-2xl font-semibold mb-4">
          <span className="text-black">Working</span>{" "}
          <span className="text-[#4F959D]">Sign In</span>
        </h2>

        <div className="flex w-full items-center">
          {/* Illustration */}
          <div className="hidden md:w-1/2 md:flex justify-center">
            <Image
              src="/login-ilustrator.png"
              alt="Person working"
              width={200}
              height={150}
            />
          </div>

          {/* Form */}
          <div className="w-full md:w-1/2 p-6">
            <form onSubmit={(e) => e.preventDefault()}>
              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}

              <div className="flex flex-col mb-4 gap-y-2">
                <label className="block text-gray-700">Username</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 md:px-4 md:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F959D] placeholder-gray-400 text-black"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  disabled={isLoading}
                />
              </div>

              <div className="flex flex-col mb-4 gap-y-2">
                <label className="block text-gray-700">Password</label>
                <input
                  type="password"
                  className="w-full px-3 py-2 md:px-4 md:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F959D] placeholder-gray-400 text-black"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  disabled={isLoading}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleLogin();
                    }
                  }}
                />
              </div>

              <button
                type="button"
                className="w-full bg-[#4F959D] text-white py-2 rounded-lg hover:bg-[#205781] transition disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleLogin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Signing In...
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            <p className="flex flex-col md:flex-row text-sm md:text-base text-center text-gray-600 mt-4">
              Don&lsquo;t have an account?
              <Link
                href="/signup"
                className="px-2 md:px-1 text-[#4F959D] font-semibold"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
