import Button from "../atoms/button";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import ChangePasswordForm from "../organisms/changePasswordForm";
import { PasswordValidationResult } from "@/lib/type/passwordValidation";
import { calculatePasswordStrength } from "@/lib/calculatePasswordStrength";
import { validatePasswordLive } from "@/lib/validatePassword";
import api from "@/lib/api";
import { AxiosError } from "axios";

const ChangePasswordTemplate = () => {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordValidation, setPasswordValidation] =
    useState<PasswordValidationResult>({
      minLength: false,
      hasLowercase: false,
      hasUppercase: false,
      hasNumber: false,
      hasSpecialChar: false
    });

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setPassword(value);
    setPasswordStrength(calculatePasswordStrength(value));
    setPasswordValidation(validatePasswordLive(value));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords don't match. Please try again.", {
        duration: 2000,
        style: { fontSize: "16px" },
        icon: null
      });
      return;
    }

    if (
      !passwordValidation.minLength ||
      !passwordValidation.hasLowercase ||
      !passwordValidation.hasUppercase ||
      !passwordValidation.hasNumber ||
      !passwordValidation.hasSpecialChar
    ) {
      toast.error("Password does not meet the security requirements.", {
        duration: 2000,
        style: { fontSize: "16px" },
        icon: null
      });
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/api/change-password", { password });
      if (response.status != 200) {
        console.log("response password", response);
      }
      toast.success("Password changed successfully!", {
        duration: 2000,
        style: { fontSize: "16px" }
      });
      router.push("/");
    } catch (error: unknown) {
      const err = error as AxiosError<{ error?: string }>;
      const message = `${err.response?.status} ${err.response?.data?.error}`;
      toast.error(message, {
        duration: 2500,
        style: { fontSize: "14px" },
        icon: null
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 md:text-center sm:text-start text-4xl font-bold tracking-tight text-gray-900">
            Change Your Password
          </h2>
          <div className="mt-2 sm:justify-start md:text-center text-base tracking-tight text-gray-600">
            For additional security, looks like it's time to update your
            password.
          </div>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
          <ChangePasswordForm
            onSubmit={handleSubmit}
            loading={loading}
            password={password}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            handlePasswordChange={handlePasswordChange}
            passwordStrength={passwordStrength}
            passwordValidation={passwordValidation}
          />

          <div className="mt-14 text-center space-y-2">
            <Button
              disabled={loading}
              onClick={() => router.push("/sign-in")}
              className={`flex w-full rounded-full tracking-tight justify-center gap-2 text-base px-4 py-2 bg-white font-normal border border-gray-300 hover:bg-gray-50 transition ${
                loading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-opacity-30 hover:cursor-pointer"
              }`}
            >
              Nevermind, I remember my password
            </Button>
          </div>
        </div>
      </div>
      <Toaster position="top-center" />
    </>
  );
};

export default ChangePasswordTemplate;
