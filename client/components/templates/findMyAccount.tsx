import Button from "../atoms/button";
import FindEmailForm from "../organisms/findEmailForm";
import { useRouter } from "next/navigation";

interface FindMyAccountPageTemplateProps {
  handleGetCredentials: (event: React.FormEvent<HTMLFormElement>) => void;
  loading: boolean;
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
}

const FindMyAccountTemplate = ({
  handleGetCredentials,
  loading,
  email,
  setEmail
}: FindMyAccountPageTemplateProps) => {
  const router = useRouter();
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 md:text-center sm:text-start text-4xl font-bold tracking-tight text-gray-900">
          Have you already created an account?
        </h2>
        <div className="mt-2 sm:justify-start md:text-center text-base tracking-tight text-gray-600">
          Looks like there’s already an account with this email—let’s help you
          sign in.
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
        <FindEmailForm
          onSubmit={handleGetCredentials}
          loading={loading}
          email={email}
          setEmail={setEmail}
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
            Let's get you signed in
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FindMyAccountTemplate;
