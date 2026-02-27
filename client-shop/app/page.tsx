"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/features/auth/context/AuthContext";
import Entry from "@/features/shared/components/Entry";

export default function Page() {
    const { isAuthenticated, loading } = useAuthContext();
    const router = useRouter();

    useEffect(() => {
        if (!loading && isAuthenticated) {
            router.replace("/home");
        }
    }, [isAuthenticated, loading, router]);

    if (loading || isAuthenticated) return null;

    return <Entry />;
}