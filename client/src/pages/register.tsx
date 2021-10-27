import { Box, Button, FormControl } from "@chakra-ui/react";
import { Form, Formik, FormikHelpers } from "formik";
import { useRouter } from 'next/router';

import InputField from "../components/InputField";
import Wrapper from "../components/Wrapper";
import { MeDocument, MeQuery, RegisterInput, useRegisterMutation } from "../generated/graphql";
import { mapFieldsErrors } from "../helper/mapFieldsErrors";


const Register = () => {
  const router = useRouter()

  const initialValues = {
    username: '',
    email: '',
    password: ''
  }

  const [registerUser, { loading: _registerUserLoading, data, error }] = useRegisterMutation()

  const onRegisterSubmit = async (values: RegisterInput, { setErrors }: FormikHelpers<RegisterInput>) => {
    const response = await registerUser({
      variables: {
        registerInput: values
      },
      update(cache, { data }) {
        if (data?.register.success) {
          cache.writeQuery<MeQuery>({
            query: MeDocument,
            data: { me: data.register.user }
          })
        }
      }
    })

    if (response?.data?.register?.errors) {
      setErrors(mapFieldsErrors(response?.data?.register?.errors))
    } else if (response?.data?.register?.user) {
      router.push('/')
    }

  }

  return (
    <Wrapper>
      {error && <p>Failed to register</p>}
      {data && data.register.success && <p>Registered successfully</p>}
      <Formik initialValues={initialValues} onSubmit={onRegisterSubmit}>
        {
          ({ isSubmitting }) => (
            <Form>
              <FormControl>
                <InputField name="username" label="Username" placeholder="Username" type="text" />
              </FormControl>
              <Box mt={4}>
                <FormControl>
                  <InputField name="email" label="Email" placeholder="Email" type="text" />
                </FormControl>
              </Box>
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