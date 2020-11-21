import { ApolloServer } from 'apollo-server-express'
import  Express from 'express'
import { buildSchema } from 'type-graphql';
import { createConnection } from 'typeorm';
import "reflect-metadata"
import { RegisterResolver } from './modules/users/Register';
import session from 'express-session';
import connectRedis from 'connect-redis'
import { redis } from './redis';
import cors from 'cors'
import { LoginResolver } from './modules/users/Login';
import { MeResolver } from './modules/users/Me';
import { ConfirmUserResolver } from './modules/users/confirmUser';
import { ForgotPasswordResolver } from './modules/users/ForgotPassword';
import { ProfilePictureResolver } from './modules/users/ProfilePicture';

const main = async() => {
    await createConnection();

    const schema = await buildSchema({
        resolvers: [RegisterResolver, LoginResolver, MeResolver, ConfirmUserResolver, ForgotPasswordResolver, ProfilePictureResolver],
        authChecker: ({ context: { req }}) => {
          return !!req.session.userId;
        }
    });
    const apolloServer = new ApolloServer({
        schema,
        context: ({ req, res }: any) => ({ req, res })
    })

    const app = Express();

    const RedisStore = connectRedis(session)

    app.use(cors({
        credentials: true,
        origin: 'http://localhost:3000'
    }))

    app.use(
        session({
          store: new RedisStore({
            client: redis as any
          }),
          name: "qid",
          secret: "aslkdfjoiq12312",
          resave: false,
          saveUninitialized: false,
          cookie: {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 1000 * 60 * 60 * 24 * 7 * 365
          }
        })
    );

    apolloServer.applyMiddleware({ app })

    app.listen(4000, () => {
        console.log("Server started on 4000")
    })
}

main();