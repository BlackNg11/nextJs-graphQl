import Navbar from '../components/Navbar';
import { addApolloState, initializeApollo } from '../lib/apolloClient';
import { PostsDocument } from "../generated/graphql";

const index = () => {
  return (
    <>
      <Navbar />
      <h1>Hello World</h1>
    </>
  );
}

export const getStaticProps = async () => {
  const apolloClient = initializeApollo()

  await apolloClient.query({
    query: PostsDocument,
  })

  return addApolloState(apolloClient, {
    props: {},
  })
}

export default index;