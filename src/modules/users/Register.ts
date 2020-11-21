import bcrypt from 'bcryptjs'
import { User } from "../../entity/User";
import { Arg, Authorized, Mutation, Query, Resolver } from "type-graphql";
import { RegisterIput } from './register/registerInput';
import { sendEmail } from '../utiles/sendEmail';
import { confirmation } from '../utiles/confirmation';

@Resolver()
export class RegisterResolver{
    @Authorized()
    @Query(() => String)
    async hello(){
        return "Hello world";
    }

    @Mutation(() => User)
    async register(
        @Arg("data"){email, firstName, lastName, password}: RegisterIput
    ): Promise<User>{
       const hashedPassword = await bcrypt.hash(password, 12)
       const user = await User.create({
           firstName,
           lastName,
           email,
           password: hashedPassword
       }).save()

       await sendEmail(email, confirmation(user.id))

       return user;
    }
}