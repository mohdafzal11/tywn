import { AuthGuard } from '@/components/auth-guard'

export default function CalendarPage() {
  return (
    <AuthGuard>
      <div>
        <h1 className="text-2xl font-bold text-[#E0E0E0] mb-6 glow">Calendar</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card">
            <h3 className="text-sm font-medium text-[#E0E0E0]/70">Total Events</h3>
            <p className="text-2xl font-bold text-[#64FFDA] mt-2 glow">1,234</p>
          </div>
          <div className="card">
            <h3 className="text-sm font-medium text-[#E0E0E0]/70">Upcoming</h3>
            <p className="text-2xl font-bold text-[#64FFDA] mt-2 glow">567</p>
          </div>
          <div className="card">
            <h3 className="text-sm font-medium text-[#E0E0E0]/70">Completed</h3>
            <p className="text-2xl font-bold text-[#64FFDA] mt-2 glow">89</p>
          </div>
          <div className="card">
            <h3 className="text-sm font-medium text-[#E0E0E0]/70">This Month</h3>
            <p className="text-2xl font-bold text-[#64FFDA] mt-2 glow">12</p>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
