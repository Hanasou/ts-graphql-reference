import "reflect-metadata";
import express from 'express';
import cors from 'cors';
// This library is a sort of compatibility layer between graphql and express
import {graphqlHTTP} from 'express-graphql';
import { buildSchema } from 'type-graphql';
import { resolvers } from './resolvers/resolvers';

const app = express();

async function bootstrap() {
    // Build our schema
    const schemaPath = "./schemagql/schema.gql"
    const mySchema = await buildSchema({
        resolvers: resolvers,
        emitSchemaFile: schemaPath,
    });

    // enable cors
    app.use(cors());

    // If we have any request comes in looking for the route "/graphql", then we want GraphQL to handle it
    app.use('/graphql', graphqlHTTP({
        schema: mySchema,
        graphiql: true,
    }))

    app.listen(4000, () => {
        console.log("Listening on port 4000");
    });
}

bootstrap();
