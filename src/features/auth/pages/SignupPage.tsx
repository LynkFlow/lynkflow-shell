import { Link } from "react-router-dom";

import AuthLayout from "../components/AuthLayout";
import SignupForm from "../components/SignupForm";

export default function SignupPage() {
  return (
    <AuthLayout>
      <h1 className="mb-4 text-2xl font-semibold text-neutral-900 sm:text-3xl">
        Create your account
      </h1>
      <p className="mb-8 text-sm text-neutral-900 sm:text-base">
        Start your journey with LynkFlow today.
      </p>
      <SignupForm />
      <p className="mt-4 text-center text-sm text-neutral-500">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-primary-500 hover:underline">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
