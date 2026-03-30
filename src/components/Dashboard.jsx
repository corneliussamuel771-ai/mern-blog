export default function DashboardLayout({ children }) {
  return (
    <div className="dashboard">
      <aside className="sidebar">
        <p>Account</p>
        <p>Privacy</p>
        <p>Security</p>
      </aside>

      <main className="dashboard-content">{children}</main>
    </div>
  );
}
