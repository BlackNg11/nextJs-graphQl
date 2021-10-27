import { Box, Flex, Heading, Button, Link } from "@chakra-ui/react";
import NextLink from 'next/link'
import { useMeQuery } from "../generated/graphql";

const Navbar = () => {
  const { data, loading, error } = useMeQuery();
  let body

  if (loading) {
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
    body = <Button>Logout</Button>
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