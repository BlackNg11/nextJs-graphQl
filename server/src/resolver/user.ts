import { LoginInput } from "./../types/LoginInput";
import { Arg, Mutation, Resolver } from "type-graphql";
import argon2 from "argon2";

import { validateRegisterInput } from "./../utils/validateRegisterInput";
import { RegisterInput } from "./../types/RegisterInput";
import { UserMutationResponse } from "./../types/UserMutationResponse";
import { User } from "./../entities/User";

@Resolver()
export default class UserResolver {
  @Mutation((_returns) => UserMutationResponse, { nullable: true })
  async register(
    @Arg("registerInput") registerInput: RegisterInput
  ): Promise<UserMutationResponse> {
    const validateRegisterInputError = validateRegisterInput(registerInput);

    if (validateRegisterInputError !== null)
      return { code: 400, success: false, ...validateRegisterInput };

    try {
      const { username, email, password } = registerInput;

      const existingUser = await User.findOne({
        where: [{ username }, { email }],
      });

      if (existingUser)
        return {
          code: 400,
          success: false,
          message: "Duplicate Username or Email",
          errors: [
            {
              field: existingUser.username === username ? "username" : "email",
              message: `${
                existingUser.username === username ? "Username" : "Email"
              } exist`,
            },
          ],
        };

      const hashedPassword = await argon2.hash(password);

      const newUser = User.create({
        username,
        email,
        password: hashedPassword,
      });

      return {
        code: 200,
        success: false,
        message: "User registration successful",
        user: await User.save(newUser),
      };
    } catch (err) {
      console.error(err);
      return {
        code: 500,
        success: false,
        message: `Internal server error ${err.message} `,
      };
    }
  }

  @Mutation((_returns) => UserMutationResponse)
  async login(
    @Arg("loginInput") { usernameOrEmail, password }: LoginInput
  ): Promise<UserMutationResponse> {
    try {
      const existingUser = await User.findOne(
        usernameOrEmail.includes("@")
          ? { email: usernameOrEmail }
          : { username: usernameOrEmail }
      );

      if (!existingUser) {
        return {
          code: 400,
          success: false,
          message: "User not found",
          errors: [
            {
              field: "usernameOrEmail",
              message: "Username or email incorrect",
            },
          ],
        };
      }

      const passwordValid = await argon2.verify(
        existingUser.password,
        password
      );

      if (!passwordValid) {
        return {
          code: 400,
          success: false,
          message: "Wrong Password",
          errors: [
            {
              field: "password",
              message: "password incorrect",
            },
          ],
        };
      }

      return {
        code: 200,
        success: true,
        message: "Logged in succcesfully",
        user: existingUser,
      };
    } catch (err) {
      console.error(err);
      return {
        code: 500,
        success: false,
        message: `Internal server error ${err.message} `,
      };
    }
  }
}
