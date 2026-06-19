// Auth layout — AppShell in root layout already skips sidebar/players for /auth routes
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
