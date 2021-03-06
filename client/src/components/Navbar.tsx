import { Box, Flex, Heading, Button, Link } from "@chakra-ui/react";
import NextLink from 'next/link'
import { MeDocument, MeQuery, useLogoutMutation, useMeQuery } from "../generated/graphql";

const Navbar = () => {
  const { data, loading: useMeLoading, error } = useMeQuery();
  const [logout, { loading: useLogoutMutationLoading }] = useLogoutMutation()

  const logoutUser = async () => {
    await logout({
      update(cache, { data }) {
        if (data?.logout) {
          cache.writeQuery<MeQuery>({
            query: MeDocument,
            data: { me: null }
          })
        }
      }
    })
  }

  let body

  if (useMeLoading) {
    body = null
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href="/login">
          <Link mr={2}>Login</Link>
        </NextLink>
        <NextLink href="/register">
          <Link>Register</Link>
        </NextLink>
      </>
    )
  } else {
    body = <Button onClick={logoutUser} isLoading={useLogoutMutationLoading}>Logout</Button>
  }


  return (
    <Box bg='tan' p={4}>
      <Flex maxW={800} justifyContent='space-between' align='center' m='auto'>
        <Heading>
          <NextLink href="/">
            <Link mr={2}>Reddit</Link>
          </NextLink>
        </Heading>
        <Box>
          {body}
        </Box>
      </Flex>
    </Box>
  );
}

export default Navbar;