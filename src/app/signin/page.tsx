"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";

export default function SignInPage() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[url('/background-login.jpg')] bg-cover bg-center opacity-20"></div>

      {/* Card Container */}
      <div className="relative bg-white shadow-lg rounded-xl m-8 md:m-0 p-8 md:p-12 w-full max-w-3xl border border-gray-200 flex flex-col items-center">
        {/* Title */}
        <h2 className="text-center text-lg md:text-2xl font-semibold mb-4 ">
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
            <form>
              <div className="flex flex-col mb-4 gap-y-2">
                <label className="block text-gray-700">Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 md:px-4 md:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F959D] placeholder-gray-400 text-black"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
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
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#4F959D] text-white py-2 rounded-lg hover:bg-[#205781] transition"
              >
                Sign In
              </button>
            </form>

            <p className="flex flex-col md:flex-row text-sm md:text-base text-center text-gray-600 mt-4">
              Don&lsquo;t have an account?
              <Link href="../" className="px-2 md:px-1 text-[#4F959D] font-semibold">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
