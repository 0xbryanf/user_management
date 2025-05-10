import { FormEvent, useState } from "react";
import { AxiosError } from "axios";
import { toast, Toaster } from "react-hot-toast";
import ValidationForm from "@/components/organisms/validationForm";
import api from "@/lib/api";
import ChangePasswordTemplate from "@/components/templates/changePasswordTemplate";
import { useRouter } from "next/navigation";

interface VerifyOTPTemplateProps {
  init: boolean;
}

const VerifyOTPTemplate = ({ init }: VerifyOTPTemplateProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  async function handleVerification(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const otp = formData.get("otp") as string;

    try {
      const otpResponse = await api.post("/api/verify-otp", {
        otp
      });

      if (otpResponse.status != 200) {
        toast.error(`${otpResponse.status} ${otpResponse.statusText}`, {
          duration: 2500,
          style: { fontSize: "14px" },
          icon: null
        });
      }

      if (init === true) {
        router.push("/");
      } else {
        setShowChangePassword(true);
      }
    } catch (error) {
      const err = error as AxiosError<{ error?: string }>;
      const message = `${err.response?.status} ${err.response?.data?.error}`;
      toast.error(message, {
        duration: 2500,
        style: { fontSize: "14px" }
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {showChangePassword ? (
        <ChangePasswordTemplate />
      ) : (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
              Verify your identity
            </h2>
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <ValidationForm onSubmit={handleVerification} loading={loading} />
          </div>
        </div>
      )}

      <Toaster position="top-center" />
    </>
  );
};

export default VerifyOTPTemplate;
