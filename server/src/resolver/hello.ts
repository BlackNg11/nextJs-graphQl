import { Context } from "./../types/Context";
import { Ctx, Query, Resolver } from "type-graphql";

@Resolver()
export default class Hello {
  @Query((_returns) => String)
  hello(@Ctx() { req }: Context) {
    console.log(req.session.userId);
    return "Hello World";
  }
}
