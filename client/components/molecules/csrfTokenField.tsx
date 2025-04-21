import React from "react";
import Input from "@/components/atoms/input";

type CsrfTokenFieldProps = {
  value: string;
};

const CsrfTokenField = ({ value }: CsrfTokenFieldProps) => (
  <div>
    <Input name="csrfToken" type="hidden" value={value} />{" "}
  </div>
);

export default CsrfTokenField;
