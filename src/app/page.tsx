import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-teal-100 to-teal-50 text-gray-800">
      {/* Hero Section */}
      <header className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2">Welcome to MiniLancing!</h1>
        <p className="text-lg text-gray-600">
          Connect with clients, showcase your skills, and thrive in freelancing.
        </p>
      </header>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/dashboard"
          className="bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 px-6 rounded-lg shadow-md transition-all"
        >
          Already Logged In? Go to Home
        </Link>
        <Link
          href="/sign-in"
          className="bg-white border border-teal-600 text-teal-600 hover:bg-blue-50 font-medium py-3 px-6 rounded-lg shadow-md transition-all"
        >
          Go to Login
        </Link>
      </div>

      {/* Footer */}
      <footer className="mt-10 text-center text-sm text-gray-500">
        Made with ❤️ by <Link href={`https://saranzafar.github.io`} className="text-teal-600 hover:text-teal-700 font-semibold">saranzafar</Link>
      </footer>
    </div>
  );
}
