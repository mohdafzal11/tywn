import { AuthGuard } from '@/components/auth-guard'

export default function DashboardPage() {
  return (
    <AuthGuard>
      <div>
        <h1 className="text-2xl font-bold text-[#E0E0E0] mb-6 glow">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card">
            <h3 className="text-sm font-medium text-[#E0E0E0]/70">Total Users</h3>
            <p className="text-2xl font-bold text-[#64FFDA] mt-2 glow">1,234</p>
          </div>
          <div className="card">
            <h3 className="text-sm font-medium text-[#E0E0E0]/70">Active Sessions</h3>
            <p className="text-2xl font-bold text-[#64FFDA] mt-2 glow">567</p>
          </div>
          <div className="card">
            <h3 className="text-sm font-medium text-[#E0E0E0]/70">Documents</h3>
            <p className="text-2xl font-bold text-[#64FFDA] mt-2 glow">89</p>
          </div>
          <div className="card">
            <h3 className="text-sm font-medium text-[#E0E0E0]/70">Events</h3>
            <p className="text-2xl font-bold text-[#64FFDA] mt-2 glow">12</p>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
