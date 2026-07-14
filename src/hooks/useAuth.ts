import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";

/** Access the auth context. Must be used within <AuthProvider>. */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth precisa estar dentro de <AuthProvider>");
  return ctx;
}
