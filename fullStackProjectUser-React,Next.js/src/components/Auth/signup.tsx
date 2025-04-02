"use client";
import { useState } from "react";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useRouter } from "next/navigation";


const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        const res = await fetch("/api/auth/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });


        const data = await res.json();

        if (data.error) {
            setError(data.error);
        } else {
            router.push("/signin");
        }
    }

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
            {error && <p className="text-red-500 text-center">{error}</p>}
            <form onSubmit={handleSignup}>
                <label className="block mb-2 font-medium">Email *</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full p-2 border rounded mb-4"
                    required
                />
                {/* setShowConfirmPassword is required */}
                <label className="block mb-2 font-medium">Password *</label>
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full p-2 border rounded mb-4"
                        required
                    />                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3">{showPassword ? <FaEyeSlash size={15} /> : <FaEye size={15} />}</button>
                </div>

                <label className="block mb-2 font-medium">Password Again *</label>
                <div className="relative">
                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Enter your password again"
                        className="w-full p-2 border rounded mb-4"
                        required
                    />                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-3">{showPassword ? <FaEyeSlash size={15} /> : <FaEye size={15} />}</button>
                </div>

                {/* Signup function is required */}
                <button className="w-full bg-[#25345A] text-white p-2 rounded mt-4">Sign Up</button>
            </form>

            <p className="mt-4 text-center">
                Already have an account? <Link href="/signin" className="text-red-500">Sign In →</Link>
            </p>

            <div className="flex items-center my-4">
                <div className="flex-1 h-px bg-gray-300"></div>
                <span className="px-3 text-gray-500">OR</span>
                <div className="flex-1 h-px bg-gray-300"></div>
            </div>

            {/* Sign up with Google button is required */}
            <button className="w-full flex items-center justify-center border p-2 rounded bg-white shadow-sm">
                <FcGoogle className="mr-2" /> Sign up with Google
            </button>
        </div>
    );
};

export default Signup;
