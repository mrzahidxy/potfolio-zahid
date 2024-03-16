import { ErrorMessage, Field } from "formik";

interface FormInputProps {
  type?: string;
  id: string;
  name: string;
  placeholder: string;
  as?: string;
}

const FormInput: React.FC<FormInputProps> = ({
  type,
  id,
  name,
  placeholder,
  as,
}) => (
  <div>
    <Field
      type={type}
      id={id}
      name={name}
      placeholder={placeholder}
      className="appearance-none bg-inherit leading-tight w-full text-gray-700 py-2 pl-2 border-b border-gray-500 focus:border-blue-500 focus:outline-none"
      as={as}
    />

    <ErrorMessage name={name} component="div" className="text-red-600" />
  </div>
);

export default FormInput;
