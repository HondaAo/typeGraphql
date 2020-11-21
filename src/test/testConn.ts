import { createConnection } from "typeorm"

export const testConn = ( drop: boolean = false) => {
    return createConnection({
        name: "default",
        type: "postgres",
        host: "localhost",
        port: 5432,
        username: "hondaao",
        password: "aosora207",
        database: "typegraph-test",
        synchronize: drop,
        dropSchema: drop,
        entities: [
           __dirname +  "../entity/*.ts"
        ]  
    })
}