import { useField } from "formik";
import { FormControl, FormLabel, FormErrorMessage, Input } from "@chakra-ui/react";

interface InputFieldProps {
  name: string,
  label: string,
  placeholder: string,
  type: string
}

const InputField = (props: InputFieldProps) => {
  const [field, { error }] = useField(props)

  return (
    <FormControl>
      <FormLabel htmlFor={field.name}>{props.label}</FormLabel>
      <Input id={field.name} {...field}  {...props} />
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
}

export default InputField;