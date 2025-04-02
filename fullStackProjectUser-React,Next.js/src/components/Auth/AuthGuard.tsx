"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push("/signin");
        }
    }, [user, router]);

    if (!user) return null;

    return <>{children}</>;
};

export default AuthGuard;
