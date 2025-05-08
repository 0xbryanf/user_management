import { useState } from "react";
import Button from "../atoms/button";
import { useRouter } from "next/navigation";

interface NoAccountFoundTemplateProps {
  user: string;
}

const NoAccountFoundTemplate = ({ user }: NoAccountFoundTemplateProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 md:text-center sm:text-start text-4xl font-bold tracking-tight text-gray-900">
          No account found with this email.
        </h2>
        <div className="mt-2 sm:justify-start md:text-center text-base tracking-tight text-gray-600">
          We couldn't find an account with this email address.
        </div>

        <h2 className="mt-10 text-center font-sans text-2xl font-bold tracking-tight text-gray-900">
          {user}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
        <Button
          disabled={loading}
          className={`flex w-full justify-center rounded-md bg-gradient-to-r from-blue-600 via-indigo-500 to-sky-400 bg-opacity-60 backdrop-blur-md px-3 py-2 text-base font-medium text-white shadow-md transition duration-200 ease-in-out focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-sky-500 ${
            loading
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-opacity-80 hover:shadow-lg hover:cursor-pointer"
          }`}
          type="button" // Changed from 'submit' to 'button' as it's not inside a form
          onClick={() => router.push("/sign-up")} // Navigate to the sign-up page
        >
          Create new account
        </Button>
      </div>
    </div>
  );
};

export default NoAccountFoundTemplate;
