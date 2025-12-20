'use client'

import { AuthProvider } from "@/context/AuthContext";

function ClientProvider({ children }: { children: React.ReactNode }) {
    return <AuthProvider>{children}</AuthProvider>;
}

export default ClientProvider