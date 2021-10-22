require("dotenv").config();
import "reflect-metadata";
import express from "express";
import { createConnection } from "typeorm";

import { User } from "./entities/User";
import { Post } from "./entities/Post";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";

import Hello from "./resolver/hello";
import UserResolver from "./resolver/user";

const main = async () => {
  await createConnection({
    type: "postgres",
    host: "localhost",
    port: 5432,
    database: "reddit",
    username: "postgres",
    password: "postgres",
    logging: true,
    synchronize: true,
    entities: [User, Post],
  });

  const app = express();

  const apolloserver = new ApolloServer({
    schema: await buildSchema({
      resolvers: [Hello, UserResolver],
      validate: false,
    }),
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
  });

  await apolloserver.start();

  apolloserver.applyMiddleware({ app, cors: false });

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

main().catch((err) => {
  console.error(err);
});
