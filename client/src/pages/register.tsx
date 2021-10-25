import { FormControl, Button, Box } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import InputField from "../components/InputField";
import Wrapper from "../components/Wrapper";

const Register = () => {
  return (
    <Wrapper>
      <Formik initialValues={{ username: '', password: '' }} onSubmit={values => console.log(values)}>
        {
          ({ isSubmitting }) => (
            <Form>
              <FormControl>
                <InputField name="username" label="Username" placeholder="Username" type="text" />
              </FormControl>
              <Box mt={4}>
                <FormControl>
                  <InputField name="password" label="Password" placeholder="Password" type="password" />
                </FormControl>
              </Box>
              <Button type="submit" colorScheme="teal" mt={4} isLoading={isSubmitting}>
                Register
              </Button>
            </Form>
          )
        }
      </Formik>
    </Wrapper>
  );
}

export default Register;