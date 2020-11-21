import bcrypt from 'bcryptjs'
import { User } from "../../entity/User";
import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { MyContext } from 'src/types/MyContext';

@Resolver()
export class LoginResolver {
    @Mutation(() => User)
    async login(
        @Arg("email") email: string,
        @Arg("password") password: string,
        @Ctx() ctx: MyContext
    ): Promise<User | null | string >{
       const user = await User.findOne({ where: { email }});
       if(!user){
           return null
       }
       const valid = await bcrypt.compare(password, user.password)

       if(!valid){
           return null
       }

       if(!user.confirmed){
        return "Your account is not valid"
       }

       ctx.req.session.userId = user.id

       return user;
    }
}