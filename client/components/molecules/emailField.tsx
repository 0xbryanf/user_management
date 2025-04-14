import React from "react";
import Input from "@/components/atoms/input";
import Label from "@/components/atoms/label";

const EmailField = () => (
  <div>
    <Label htmlFor="email">Email address</Label>
    <div className="mt-2">
      <Input
        id="email"
        name="email"
        type="email"
        autoComplete="email"
        required
      />
    </div>
  </div>
);

export default EmailField;
