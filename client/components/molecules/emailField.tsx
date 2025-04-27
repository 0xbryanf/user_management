import React from "react";
import Input from "@/components/atoms/input";
import Label from "@/components/atoms/label";

type EmailFieldProps = {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const EmailField = ({ value, onChange }: EmailFieldProps) => (
  <div>
    <div className="mt-1">
      <Input
        id="email"
        name="email"
        type="email"
        autoComplete="email"
        required
        value={value}
        placeholder="Email"
        onChange={onChange}
      />
    </div>
  </div>
);

export default EmailField;
