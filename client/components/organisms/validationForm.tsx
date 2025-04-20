import React from "react";
import PasswordField from "@/components/molecules/passwordField";
import Button from "@/components/atoms/button";
import { FcGoogle } from "react-icons/fc";
import OtpField from "../molecules/otpField";

const ValidationForm = ({
  onSubmit,
  loading
}: {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  loading: boolean;
}) => (
  <>
    <form className="space-y-6" onSubmit={onSubmit}>
      <OtpField />
      <Button
        disabled={loading}
        className={`flex w-full justify-center rounded-md bg-gradient-to-r from-blue-600 via-indigo-500 to-sky-400 bg-opacity-60 backdrop-blur-md px-3 py-2 text-base font-semibold text-white shadow-md transition duration-200 ease-in-out focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-sky-500 ${
          loading
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-opacity-80 hover:shadow-lg hover:cursor-pointer"
        }`}
        type="submit"
      >
        Submit
      </Button>
    </form>
    <div className="flex items-center gap-4 my-10">
      <hr className="flex-grow border-gray-300" />
      <span className="text-gray-500 text-sm">or</span>
      <hr className="flex-grow border-gray-300" />
    </div>
    <Button
      disabled={loading}
      // onClick={() => signIn("google")}
      className={`flex w-full justify-center gap-2 px-4 py-2 rounded-md bg-white text-black border border-gray-300 hover:bg-gray-100 transition text-base ${
        loading
          ? "opacity-50 cursor-not-allowed"
          : "hover:bg-opacity-80 hover:shadow-lg hover:cursor-pointer"
      }`}
    >
      <FcGoogle className="text-xl" />
      <span>Confirm identity with Google</span>
    </Button>
  </>
);

export default ValidationForm;
