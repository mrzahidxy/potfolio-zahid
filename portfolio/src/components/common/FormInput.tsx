import { ErrorMessage, Field } from "formik";

interface FormInputProps {
  type?: string;
  id: string;
  name: string;
  placeholder: string;
  as?: string;
  rows?: number;
  className?: string;
}

const FormInput: React.FC<FormInputProps> = ({
  type,
  id,
  name,
  placeholder,
  as,
  rows,
  className,
}) => (
  <div>
    <Field
      type={type}
      id={id}
      name={name}
      placeholder={placeholder}
      className={`w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2.5 text-sm leading-6 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50 dark:placeholder:text-slate-400 ${className ?? ""}`}
      as={as}
      rows={rows}
    />

    <ErrorMessage name={name} component="div" className="text-red-600" />
  </div>
);

export default FormInput;
