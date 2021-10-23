import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import argon2 from "argon2";

import { validateRegisterInput } from "./../utils/validateRegisterInput";
import { RegisterInput } from "./../types/RegisterInput";
import { UserMutationResponse } from "./../types/UserMutationResponse";
import { User } from "./../entities/User";
import { LoginInput } from "./../types/LoginInput";
import { Context } from "./../types/Context";
import { COOKIE_NAME } from "./../constants";

@Resolver()
export default class UserResolver {
  @Mutation((_returns) => UserMutationResponse, { nullable: true })
  async register(
    @Arg("registerInput") registerInput: RegisterInput,
    @Ctx() { req }: Context
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

      let newUser = User.create({
        username,
        email,
        password: hashedPassword,
      });

      newUser = await User.save(newUser);

      req.session.userId = newUser.id;

      return {
        code: 200,
        success: false,
        message: "User registration successful",
        user: newUser,
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
    @Arg("loginInput") { usernameOrEmail, password }: LoginInput,
    @Ctx() { req }: Context
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

      // Create Seasion And Return Cookie
      req.session.userId = existingUser.id;

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

  @Mutation((_returns) => Boolean)
  logout(@Ctx() { req, res }: Context): Promise<boolean> {
    return new Promise((resolve, _) => {
      res.clearCookie(COOKIE_NAME);
      req.session.destroy((err) => {
        if (err) {
          console.error(err);
          resolve(false);
        }

        resolve(true);
      });
    });
  }
}
