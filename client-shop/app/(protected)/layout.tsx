import { ProtectedRoute } from "@/features/shared/components/ProtectedRoute";
import { Header } from "@/features/shared/components/Header";
import { Footer } from "@/features/shared/components/Footer";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-neutral-950">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}