import React from "react";
import Button from "@/components/atoms/button";
import { FcGoogle } from "react-icons/fc";
import OtpField from "../molecules/otpField";

const ConfirmIdentityForm = ({
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
  </>
);

export default ConfirmIdentityForm;
