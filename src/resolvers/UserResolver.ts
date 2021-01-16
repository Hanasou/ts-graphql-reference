import { Arg, FieldResolver, Mutation, Query, Resolver, ResolverInterface, Root } from "type-graphql";
import { AddUserInput, Company, User } from "../schemas/schema";

// Mark our resolver with a @Resolver decorator
// This behaves like Controllers in a REST framework
@Resolver(of => User)
export class UserResolver implements ResolverInterface<User> {
    // Use dependency injection to store data in our resolver class
    // Guaranteed to be a single instance per app
    private readonly companyCollection: Company[] = generateCompanyData();
    private readonly userCollection: User[] = generateUserData(this.companyCollection);
    

    // Method to return our users
    // We need to mark this as a GraphQL Query by adding the @Query decorator
    // We also need to provide the return type inside the decorator
    // returns => [User] denotes that we're returning an array of Users
    @Query(returns => [User])
    async users(): Promise<User[]> {
        return await this.userCollection;
    }

    // We also have to define arguments using the @Arg decorator
    // We can do this inline if we don't have that many arguments
    // But for lots of arguments, we can define them in a class
    // Let's label everything one at a time

    // Query decorator. We can pass in an options object. In this case, we note that we may return null.
    @Query(returns => User, {nullable: true})
    // Method signature.
    async user(
        // Argument decorator and parameter. We're passing in an id string into this method.
        @Arg("id") id: string
    ): Promise<User | undefined> { // We're returning a promise or undefined if we can't find the User
        const user = await this.userCollection.find(user => user.id === id);
        return user; // Find the user by id
    }

    // Return a list of users that work for a given company
    @Query(returns => [User])
    async usersForCompany(
        @Arg("companyName") companyName: string
    ): Promise<User[]> {
        return await this.userCollection.filter(user => user.company.name === companyName);
    }

    // This should correspond to our InputType schema
    @Mutation(returns => User)
    async addUser(
        @Arg("user") addUserInput: AddUserInput // Take in our AddUserInput InputType
    ): Promise<User> {
        let companyName = "Unemployed";
        if (addUserInput.companyName) {
            companyName = addUserInput.companyName;
        }
        // Find the name of the company the user put in
        let company = this.companyCollection.find(company => company.name === companyName);
        // If we can't find it then default to unemployed
        if (company === undefined) {
            company = this.companyCollection.find(company => company.name === "Unemployed");
        }
        // Create a user with Object.assign
        // They explicitly said to not use a constructor so I guess I have to do it like this?
        const user = Object.assign(new User(), {
            id: Math.floor(Math.random() * 100000).toString(),
            firstName: addUserInput.firstName,
            age: addUserInput.age,
            company: company,
        });
        // Push user to our pseudo-database
        await this.userCollection.push(user);
        // return
        return user;
    }

    // We want to access a nested field in our UserSchema
    // We have to decorate this with a @FieldResolver()
    // Our function takes in a @Root() argument to define what we're getting our nested field from
    @FieldResolver()
    async company(
        @Root() user: User
    ): Promise<Company> {
        return await user.company;
    }
}

// Helper functions here

const randomModifier: number = 100000;

function generateId(modifier: number): string {
    return Math.floor(Math.random() * modifier).toString();
}

function getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
  }

function createUser(userData: Partial<User>) {
    const user = Object.assign(new User(), userData);
    user.id = generateId(randomModifier);
    return user;
}

function createCompany(companyData: Partial<Company>) {
    const company = Object.assign(new Company(), companyData);
    company.id = generateId(randomModifier);
    return company;
}

function generateCompanyData(): Company[] {
    return [
        createCompany({
            name: "Unemployed",
            description: "",
        }),
        createCompany({
            name: "Google",
            description: "search engine",
        }),
        createCompany({
            name: "Microsoft",
            description: "windows",
        }),
        createCompany({
            name: "Apple",
            description: "mac",
        }),
    ];
}

function generateUserData(companies: Company[]): User[] {
    const usersData = [
        createUser({
            firstName: "Roy",
            age: 22,
            company: companies[getRandomInt(0,companies.length)],
        }),
        createUser({
            firstName: "Todd",
            age: 43,
            company: companies[getRandomInt(0,companies.length)],
        }),
        createUser({
            firstName: "Bill",
            age: 66,
            company: companies[getRandomInt(0,companies.length)],
        }),
        createUser({
            firstName: "Bob",
            age: 83,
            company: companies[getRandomInt(0,companies.length)],
        }),
    ];
    return usersData;
}