import { auth, signOut } from "@/auth";
import Link from "next/link";

function SignIn() {
  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Pawmery Pet Care</h2>
      <p className="text-gray-600 mb-8">
        Your trusted companion for managing your pets' health and well-being. 
        Sign in to access your dashboard and manage your pets.
      </p>
      <Link
        href="/login"
        className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors"
      >
        Sign In
      </Link>
    </div>
  );
}

function SignOut({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome Back!</h2>
      <p className="text-lg text-gray-700 mb-8">{children}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link
          href="/dashboard"
          className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow border"
        >
          <div className="text-blue-600 text-3xl mb-2">📊</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Dashboard</h3>
          <p className="text-gray-600 text-sm">View your pet care overview and recent activity</p>
        </Link>
        
        <Link
          href="/pets"
          className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow border"
        >
          <div className="text-green-600 text-3xl mb-2">🐾</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">My Pets</h3>
          <p className="text-gray-600 text-sm">Manage your pets and schedule appointments</p>
        </Link>
        
        <Link
          href="/profile"
          className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow border"
        >
          <div className="text-purple-600 text-3xl mb-2">⚙️</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Profile</h3>
          <p className="text-gray-600 text-sm">Update your account settings and preferences</p>
        </Link>
      </div>
      
      <form
        action={async () => {
          "use server";
          await signOut();
        }}
      >
        <button 
          type="submit"
          className="bg-gray-600 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-700 transition-colors"
        >
          Sign out
        </button>
      </form>
    </div>
  );
}

export default async function Page() {
  let session = await auth();
  let user = session?.user?.email;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">🐾 Pawmery Pet Care</h1>
          <p className="text-xl text-gray-600">
            Professional pet care management at your fingertips
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-8">
          {user ? (
            <SignOut>{`Welcome back, ${user}!`}</SignOut>
          ) : (
            <SignIn />
          )}
        </div>
        
        {!user && (
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
              Why Choose Pawmery?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl mb-4">🏥</div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Health Tracking</h4>
                <p className="text-gray-600">Keep track of vaccinations, checkups, and medical history</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">📅</div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Appointment Scheduling</h4>
                <p className="text-gray-600">Easy scheduling with reminders and notifications</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">📱</div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Mobile Friendly</h4>
                <p className="text-gray-600">Access your pet information anywhere, anytime</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
