import { buildSchema } from "type-graphql";
import { ConfirmUserResolver } from "../modules/users/confirmUser";
import { ForgotPasswordResolver } from "../modules/users/ForgotPassword";
import { LoginResolver } from "../modules/users/Login";
import { MeResolver } from "../modules/users/Me";
import { ProfilePictureResolver } from "../modules/users/ProfilePicture";
import { RegisterResolver } from "../modules/users/Register";

export const createSchema = () => buildSchema({
    resolvers: [RegisterResolver, LoginResolver, MeResolver, ConfirmUserResolver, ForgotPasswordResolver, ProfilePictureResolver],
    authChecker: ({ context: { req }}) => {
      return !!req.session.userId;
    }
});