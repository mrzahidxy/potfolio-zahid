import { ErrorMessage, Field } from "formik";

interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  as?: string;
  accept?: string;
  className: string;
}

export default function CustomFormField({
  label,
  name,
  type = "text",
  as,
  accept,
  className,
}: FormFieldProps) {
  return (
    <div className="grid grid-cols-10 items-center">
      <label htmlFor={name} className="font-medium col-span-2">
        {label}
      </label>
      <div className="flex flex-col col-span-8">
        <Field
          type={type}
          id={name}
          name={name}
          className={`py-2 rounded-md ${className}`}
          as={as}
          accept={accept}
        />
        <div className="text-red-500">
          <ErrorMessage name={name} />
        </div>
      </div>
    </div>
  );
}
