import { User } from "./../entities/User";
import { Arg, Mutation, Resolver } from "type-graphql";
import argon2 from "argon2";

@Resolver()
export default class UserResolver {
  @Mutation((_returns) => User, { nullable: true })
  async register(
    @Arg("email") email: string,
    @Arg("username") username: string,
    @Arg("password") password: string
  ): Promise<User | null> {
    try {
      const existingUser = await User.findOne({ username });

      if (existingUser) return null;

      const hashedPassword = await argon2.hash(password);

      const newUser = User.create({
        username,
        email,
        password: hashedPassword,
      });

      return await User.save(newUser);
    } catch (err) {
      console.error(err);
      return null;
    }
  }
}