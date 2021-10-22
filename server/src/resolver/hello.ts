import { Query, Resolver } from "type-graphql";

@Resolver()
export default class Hello {
  @Query((_returns) => String)
  hello() {
    return "Hello World";
  }
}
