type PasswordStrengthBarProps = {
  passwordStrength: number;
};

const PasswordStrengthBar = ({
  passwordStrength
}: PasswordStrengthBarProps) => (
  <div className="mt-2">
    <div className="relative w-full h-1 bg-gray-200 rounded">
      <div
        className={`absolute top-0 left-0 h-1 rounded ${
          passwordStrength <= 2
            ? "bg-red-500"
            : passwordStrength === 3
              ? "bg-yellow-500"
              : "bg-green-500"
        }`}
        style={{
          width: `${(passwordStrength / 5) * 100}%`,
          transition: "width 0.3s ease"
        }}
      ></div>
    </div>
    <div className="text-center mt-1 text-[10px] text-gray-400">
      {passwordStrength <= 2
        ? "Your password is too weak."
        : passwordStrength === 3
          ? "Getting better! Almost strong."
          : passwordStrength === 4
            ? "Great! Your password is strong."
            : "Excellent! You have a very strong password."}
    </div>
  </div>
);

export default PasswordStrengthBar;
