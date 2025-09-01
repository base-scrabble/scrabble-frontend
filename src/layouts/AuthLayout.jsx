import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow rounded-xl p-6 w-full max-w-md">
        <Outlet />
      </div>
    </div>
  );
}
