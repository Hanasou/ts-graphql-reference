import {ObjectType, Field, ID, Int, InputType} from "type-graphql";


// Let's try nesting some objects together
@ObjectType()
export class Company {
    @Field(type => ID)
    id: string;

    @Field()
    name: string;

    @Field()
    description: string;
}

// type-graphql uses objects and classes to define schemas
// @ObjectType() decorator to say that this class is a schema
@ObjectType()
export class User {

    // We use the @Field() to define that this element is a field
    // We can set some options inside our Field() decorator
    // In this case, we're going to set the type to ID
    @Field(type => ID)
    id: string;

    @Field()
    firstName: string;

    // The type we set in our Field() decorator denotes the GraphQL type
    // We set age to number in Typescript, but that should translate to Int in GraphQL
    @Field(type => Int)
    age: number;

    // Nested type
    // Make sure to have "type => Company" to avoid circular reference
    @Field(type => Company, { nullable: true })
    company: Company;
}

// If we want to modify data (POST and PUT in REST), then we need to define
// an input type. Similar to ObjectType except with @InputType decorator
@InputType()
export class AddUserInput implements Partial<User> { // make sure we don't accidentally change the property type
    // Declare our input fields
    @Field()
    firstName: string;
    
    @Field(type => Int)
    age: number;

    @Field({nullable: true})
    companyName: string;
}