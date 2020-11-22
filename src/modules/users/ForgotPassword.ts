import { User } from "../../entity/User";
import { Arg, Mutation, Resolver } from "type-graphql";
import { redis } from '../../redis';
import { sendEmail } from "../utiles/sendEmail";
import { v4 } from "uuid";
import { forgotPasswordPrefix } from "../../constants/redisPrefix";

@Resolver()
export class ForgotPasswordResolver {
    @Mutation(() => Boolean)
    async confirmUser(
        @Arg("email") email: string,
    ): Promise<boolean>{
      const user = await User.findOne({ where: {email}})

      if(!user){
          return false;
      }
      const token = v4();
      redis.set( forgotPasswordPrefix + token, user.id, "ex", 60*60*24);
      await sendEmail(email, `http://localhost:3000/confirm/${token}`)
      return true 
    } 
}