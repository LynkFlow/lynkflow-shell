import { Link } from "react-router-dom";

import AuthLayout from "../../../layouts/AuthLayout";
import LoginForm from "../components/LoginForm";

export default function LoginPage() {
  return (
    <AuthLayout>
      <h1 className="mb-2 text-2xl font-semibold text-neutral-900 sm:text-3xl">
        Welcome Back
      </h1>
      <p className="mb-8 text-sm text-neutral-500 sm:text-base">
        Sign in to your LynkFlow account to continue.
      </p>

      <LoginForm />

      <p className="mt-6 text-center text-sm text-neutral-500">
        Don't have an account?{" "}
        <Link to="/register" className="font-medium text-primary-500 hover:underline">
          Sign up
        </Link>
      </p>
    </AuthLayout>
  );
}
