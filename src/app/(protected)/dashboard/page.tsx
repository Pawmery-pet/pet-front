import { auth } from "@/auth";

export default async function DashboardPage() {
  const session = await auth();

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Dashboard</h2>
        <p className="text-gray-600 mb-6">
          Welcome to your protected dashboard! Only authenticated users can see this page.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Pets</h3>
            <p className="text-3xl font-bold text-blue-600">5</p>
            <p className="text-sm text-gray-500">Total pets in care</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Appointments</h3>
            <p className="text-3xl font-bold text-green-600">3</p>
            <p className="text-sm text-gray-500">Today's appointments</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Messages</h3>
            <p className="text-3xl font-bold text-purple-600">12</p>
            <p className="text-sm text-gray-500">Unread messages</p>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Fluffy</span> had a checkup appointment
              </p>
              <p className="text-xs text-gray-500">2 hours ago</p>
            </div>
            <div className="px-6 py-4 border-b border-gray-200">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Max</span> vaccination reminder sent
              </p>
              <p className="text-xs text-gray-500">4 hours ago</p>
            </div>
            <div className="px-6 py-4">
              <p className="text-sm text-gray-600">
                New appointment scheduled for <span className="font-medium">Bella</span>
              </p>
              <p className="text-xs text-gray-500">Yesterday</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 