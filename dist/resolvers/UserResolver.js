"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResolver = void 0;
const type_graphql_1 = require("type-graphql");
const schema_1 = require("../schemas/schema");
// Mark our resolver with a @Resolver decorator
// This behaves like Controllers in a REST framework
let UserResolver = class UserResolver {
    constructor() {
        // Use dependency injection to store data in our resolver class
        // Guaranteed to be a single instance per app
        this.companyCollection = generateCompanyData();
        this.userCollection = generateUserData(this.companyCollection);
    }
    // Method to return our users
    // We need to mark this as a GraphQL Query by adding the @Query decorator
    // We also need to provide the return type inside the decorator
    // returns => [User] denotes that we're returning an array of Users
    async users() {
        return await this.userCollection;
    }
    // We also have to define arguments using the @Arg decorator
    // We can do this inline if we don't have that many arguments
    // But for lots of arguments, we can define them in a class
    // Let's label everything one at a time
    // Query decorator. We can pass in an options object. In this case, we note that we may return null.
    // Method signature.
    async user(
    // Argument decorator and parameter. We're passing in an id string into this method.
    id) {
        const user = await this.userCollection.find(user => user.id === id);
        return user; // Find the user by id
    }
    // Return a list of users that work for a given company
    async usersForCompany(companyName) {
        return await this.userCollection.filter(user => user.company.name === companyName);
    }
    // This should correspond to our InputType schema
    async addUser(addUserInput // Take in our AddUserInput InputType
    ) {
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
        const user = Object.assign(new schema_1.User(), {
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
    async company(user) {
        return await user.company;
    }
};
__decorate([
    type_graphql_1.Query(returns => [schema_1.User]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "users", null);
__decorate([
    type_graphql_1.Query(returns => schema_1.User, { nullable: true }),
    __param(0, type_graphql_1.Arg("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "user", null);
__decorate([
    type_graphql_1.Query(returns => [schema_1.User]),
    __param(0, type_graphql_1.Arg("companyName")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "usersForCompany", null);
__decorate([
    type_graphql_1.Mutation(returns => schema_1.User),
    __param(0, type_graphql_1.Arg("user")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [schema_1.AddUserInput // Take in our AddUserInput InputType
    ]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "addUser", null);
__decorate([
    type_graphql_1.FieldResolver(),
    __param(0, type_graphql_1.Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [schema_1.User]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "company", null);
UserResolver = __decorate([
    type_graphql_1.Resolver(of => schema_1.User)
], UserResolver);
exports.UserResolver = UserResolver;
// Helper functions here
const randomModifier = 100000;
function generateId(modifier) {
    return Math.floor(Math.random() * modifier).toString();
}
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}
function createUser(userData) {
    const user = Object.assign(new schema_1.User(), userData);
    user.id = generateId(randomModifier);
    return user;
}
function createCompany(companyData) {
    const company = Object.assign(new schema_1.Company(), companyData);
    company.id = generateId(randomModifier);
    return company;
}
function generateCompanyData() {
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
function generateUserData(companies) {
    const usersData = [
        createUser({
            firstName: "Roy",
            age: 22,
            company: companies[getRandomInt(0, companies.length)],
        }),
        createUser({
            firstName: "Todd",
            age: 43,
            company: companies[getRandomInt(0, companies.length)],
        }),
        createUser({
            firstName: "Bill",
            age: 66,
            company: companies[getRandomInt(0, companies.length)],
        }),
        createUser({
            firstName: "Bob",
            age: 83,
            company: companies[getRandomInt(0, companies.length)],
        }),
    ];
    return usersData;
}
