import {
  Arg,
  ID,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";

import { UpdatePostInput } from "./../types/UpdatePostInput";
import { Post } from "./../entities/Post";
import { CreatePostInput } from "./../types/CreatePostInput";
import { PostMutationResponse } from "./../types/PostMutationResponse";
import { checkAuth } from "./../middleware/checkAuth";

@Resolver()
export default class PostResolver {
  @Mutation((_return) => PostMutationResponse)
  async createPost(
    @Arg("createPostInput") { title, text }: CreatePostInput
  ): Promise<PostMutationResponse> {
    try {
      const newPost = Post.create({ title, text });

      await newPost.save();

      return {
        code: 200,
        success: true,
        message: `Post created successfully`,
        post: newPost,
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

  @Mutation((_return) => PostMutationResponse)
  async updatePost(
    @Arg("updatePostInput") { id, title, text }: UpdatePostInput
  ): Promise<PostMutationResponse> {
    try {
      const existingPost = await Post.findOne(id);

      if (!existingPost)
        return {
          code: 400,
          success: false,
          message: `Post not found`,
        };

      existingPost.title = title;
      existingPost.text = text;

      await existingPost.save();

      return {
        code: 200,
        success: true,
        message: `Post updated successfully`,
        post: existingPost,
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

  @Mutation((_return) => PostMutationResponse)
  @UseMiddleware(checkAuth)
  async deletePost(
    @Arg("id", (_type) => ID) id: number
  ): Promise<PostMutationResponse> {
    try {
      const existingPost = await Post.findOne(id);

      if (!existingPost)
        return {
          code: 400,
          success: false,
          message: `Post not found`,
        };

      await Post.delete({ id });

      return {
        code: 200,
        success: true,
        message: `Post delete successfully`,
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

  @Query((_return) => [Post], { nullable: true })
  async posts(): Promise<Post[] | undefined> {
    try {
      return Post.find();
    } catch (err) {
      console.error(err);
      return undefined;
    }
  }

  @Query((_return) => Post)
  async post(@Arg("id", (_type) => ID) id: number): Promise<Post | undefined> {
    try {
      const post = await Post.findOne(id);

      return post;
    } catch (err) {
      console.error(err);
      return undefined;
    }
  }
}
