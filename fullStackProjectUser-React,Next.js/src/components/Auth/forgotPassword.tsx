"use client";
import { useState } from "react";
import Link from "next/link";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");

    const handleReset = () => {
        // reset password function is required
    }

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Forgot Password</h2>
            <form onSubmit={handleReset}>
                <label className="block mb-2 font-medium">Email *</label>
                <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full p-2 border rounded mb-4"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit" className="w-full bg-[#25345A] text-white p-2 rounded mt-4">Reset Password</button>
            </form>


            <p className="mt-4 text-center">
                Remembered your password? <Link href="/signin" className="text-red-500">Sign In →</Link>
            </p>
        </div>
    );
};

export default ForgotPassword;
