import { ProtectedRoute } from "@/features/shared/components/ProtectedRoute";
import { Header } from "@/features/shared/components/Header";
import { Footer } from "@/features/shared/components/Footer";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen bg-neutral-950">
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}