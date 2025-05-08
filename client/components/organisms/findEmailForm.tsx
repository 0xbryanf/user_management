import React from "react";
import Button from "@/components/atoms/button";
import EmailField from "../molecules/emailField";

type SignUpFormProps = {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  loading: boolean;
  email: string;
  setEmail: (value: string) => void;
};

const FindEmailForm = ({
  onSubmit,
  loading,
  email,
  setEmail
}: SignUpFormProps) => (
  <>
    <form className="space-y-4" onSubmit={onSubmit}>
      <EmailField value={email} onChange={(e) => setEmail(e.target.value)} />
      <Button
        disabled={loading}
        className={`flex w-full justify-center rounded-md bg-gradient-to-r from-blue-600 via-indigo-500 to-sky-400 bg-opacity-60 backdrop-blur-md px-3 py-2 text-base font-medium text-white shadow-md transition duration-200 ease-in-out focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-sky-500 ${
          loading
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-opacity-80 hover:shadow-lg hover:cursor-pointer"
        }`}
        type="submit"
      >
        Find my account
      </Button>
    </form>
  </>
);

export default FindEmailForm;
