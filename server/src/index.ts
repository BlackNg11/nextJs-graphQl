require("dotenv").config();
import "reflect-metadata";
import express from "express";
import { createConnection } from "typeorm";

import { User } from "./entities/User";
import { Post } from "./entities/Post";

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

  app.listen(4000, () => console.log(`Server running on port 4000`));
};

main().catch((err) => {
  console.error(err);
});
