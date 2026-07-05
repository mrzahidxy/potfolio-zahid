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
      className={`w-full rounded-[14px] border border-slate-200/80 bg-white px-3.5 py-2.5 text-[14px] leading-6 text-slate-900 placeholder:text-slate-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_1px_2px_rgba(15,23,42,0.04)] outline-none transition duration-200 focus:border-sky-400 focus:ring-4 focus:ring-sky-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50 dark:placeholder:text-slate-400 dark:focus:ring-sky-950 ${className ?? ""}`}
      as={as}
      rows={rows}
    />

    <ErrorMessage
      name={name}
      component="div"
      className="mt-1.5 text-[12px] font-medium text-red-600 dark:text-red-400"
    />
  </div>
);

export default FormInput;
