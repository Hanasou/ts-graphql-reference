"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
// This library is a sort of compatibility layer between graphql and express
const express_graphql_1 = require("express-graphql");
const type_graphql_1 = require("type-graphql");
const resolvers_1 = require("./resolvers/resolvers");
const app = express_1.default();
async function bootstrap() {
    // Build our schema
    const schemaPath = "./schemagql/schema.gql";
    const mySchema = await type_graphql_1.buildSchema({
        resolvers: resolvers_1.resolvers,
        emitSchemaFile: schemaPath,
    });
    // enable cors
    app.use(cors_1.default());
    // If we have any request comes in looking for the route "/graphql", then we want GraphQL to handle it
    app.use('/graphql', express_graphql_1.graphqlHTTP({
        schema: mySchema,
        graphiql: true,
    }));
    app.listen(4000, () => {
        console.log("Listening on port 4000");
    });
}
bootstrap();
