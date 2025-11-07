import { AuthProvider } from "@/contexts/AuthContext";

export default function Layout({ children }) {
    return <AuthProvider>{children}</AuthProvider>
}