import { Box, Button, FormControl } from "@chakra-ui/react";
import { Form, Formik, FormikHelpers } from "formik";
import { useRouter } from 'next/router';

import InputField from "../components/InputField";
import Wrapper from "../components/Wrapper";
import { LoginInput, MeDocument, MeQuery, useLoginMutation } from "../generated/graphql";
import { mapFieldsErrors } from "../helper/mapFieldsErrors";


const Login = () => {
  const router = useRouter()

  const initialValues: LoginInput = {
    usernameOrEmail: '',
    password: ''
  }

  const [loginUser, { loading: _loginUserLoading, data, error }] = useLoginMutation()

  const onLoginSubmit = async (values: LoginInput, { setErrors }: FormikHelpers<LoginInput>) => {
    const response = await loginUser({
      variables: {
        loginInput: values
      },
      update(cache, { data }) {
        // const meData = cache.readQuery({
        //   query: MeDocument
        // })

        if (data?.login.success) {
          const meData = cache.writeQuery<MeQuery>({
            query: MeDocument,
            data: { me: data.login.user }
          })
        }
      }
    })

    if (response?.data?.login?.errors) {
      setErrors(mapFieldsErrors(response?.data?.login?.errors))
    } else if (response?.data?.login?.user) {
      router.push('/')
    }

  }

  return (
    <Wrapper>
      {error && <p>Failed to register</p>}
      {data && data.login.success && <p>Login successfully</p>}
      <Formik initialValues={initialValues} onSubmit={onLoginSubmit}>
        {
          ({ isSubmitting }) => (
            <Form>
              <FormControl>
                <InputField name="usernameOrEmail" label="Username or Email" placeholder="Username or Email" type="text" />
              </FormControl>
              <Box mt={4}>
                <FormControl>
                  <InputField name="password" label="Password" placeholder="Password" type="password" />
                </FormControl>
              </Box>
              <Button type="submit" colorScheme="teal" mt={4} isLoading={isSubmitting}>
                Login
              </Button>
            </Form>
          )
        }
      </Formik>
    </Wrapper>
  );
}

export default Login;