import { testConn } from "../../../test/testConn"
import { Connection } from "typeorm";
import { gCall } from "../../../test/gCall";
import faker from 'faker'
import { User } from "src/entity/User";

let conn : Connection

beforeAll(async () => {
    conn = await testConn();
})

afterAll(async() => {
     await conn.close();
})

const registerMutation = `
 mutation Register($data: RegisterIput!){
     register(data: $data){
         id 
         name
         email
     }
 }
`

describe('Register', () =>{
    it("create user", async() => {
     const user = {
         firstName: faker.name.firstName(),
         lastName: faker.name.lastName(),
         email: faker.internet.email(),
         password: faker.internet.password()
     }
      const res = await gCall({
           source: registerMutation,
           variableValues: {
               data: user
           }
       })
       expect(res).toMatchObject({
           data: {
               register: {
                   firstName: user.firstName,
                   lastName: user.lastName,
                   email: user.email
               }
           }
       })
       const dbUser = await User.findOne({ where : {email: user.email}});
       expect(dbUser).toBeDefined()
       expect(dbUser!.confirmed).toBeFalsy();
    })

})