// Auth layout bypasses the main app shell (Sidebar, Players, etc.)
// This gives us a full-screen canvas for the premium auth experience
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="auth-shell">
      {children}
    </div>
  );
}
