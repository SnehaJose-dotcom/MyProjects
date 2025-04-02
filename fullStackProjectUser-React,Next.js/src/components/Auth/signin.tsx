"use client";
import { useState } from "react";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "@/app/context/AuthContext";


const Signin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const { login } = useAuth();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            await login(email, password, rememberMe);
        } catch (err) {
            console.error("Login error:", err);
            setError("Invalid email or password");
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
            
            {error && <p className="text-red-500 text-center">{error}</p>}
            
            <form onSubmit={handleLogin}>
                <label className="block mb-2 font-medium">Email *</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full p-2 border rounded mb-4"
                    required
                />

                <label className="block mb-2 font-medium">Password *</label>
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full p-2 border rounded mb-4"
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3"
                    >
                        {showPassword ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
                    </button>
                </div>

                <div className="flex justify-between items-center mb-4">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            className="mr-2"
                            checked={rememberMe}
                            onChange={() => setRememberMe(!rememberMe)}
                        />
                        Remember me
                    </label>
                    <Link href="/forgotpassword" className="text-red-500">Forgot Password?</Link>
                </div>

                <button className="w-full bg-[#25345A] text-white p-2 rounded mt-4">Sign In</button>
            </form>

            <p className="mt-4 text-center">
                Don&apos;t have an account yet? <Link href="/signup" className="text-red-500">Create account →</Link>
            </p>

            <div className="flex items-center my-4">
                <div className="flex-1 h-px bg-gray-300"></div>
                <span className="px-3 text-gray-500">OR</span>
                <div className="flex-1 h-px bg-gray-300"></div>
            </div>

            <button className="w-full flex items-center justify-center border p-2 rounded bg-white shadow-sm">
                <FcGoogle className="mr-2" /> Sign in with Google
            </button>
        </div>
    );
};

export default Signin;
