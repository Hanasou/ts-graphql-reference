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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddUserInput = exports.User = exports.Company = void 0;
const type_graphql_1 = require("type-graphql");
// Let's try nesting some objects together
let Company = class Company {
};
__decorate([
    type_graphql_1.Field(type => type_graphql_1.ID),
    __metadata("design:type", String)
], Company.prototype, "id", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], Company.prototype, "name", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], Company.prototype, "description", void 0);
Company = __decorate([
    type_graphql_1.ObjectType()
], Company);
exports.Company = Company;
// type-graphql uses objects and classes to define schemas
// @ObjectType() decorator to say that this class is a schema
let User = class User {
};
__decorate([
    type_graphql_1.Field(type => type_graphql_1.ID),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    type_graphql_1.Field(type => type_graphql_1.Int),
    __metadata("design:type", Number)
], User.prototype, "age", void 0);
__decorate([
    type_graphql_1.Field(type => Company, { nullable: true }),
    __metadata("design:type", Company)
], User.prototype, "company", void 0);
User = __decorate([
    type_graphql_1.ObjectType()
], User);
exports.User = User;
// If we want to modify data (POST and PUT in REST), then we need to define
// an input type. Similar to ObjectType except with @InputType decorator
let AddUserInput = class AddUserInput {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], AddUserInput.prototype, "firstName", void 0);
__decorate([
    type_graphql_1.Field(type => type_graphql_1.Int),
    __metadata("design:type", Number)
], AddUserInput.prototype, "age", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", String)
], AddUserInput.prototype, "companyName", void 0);
AddUserInput = __decorate([
    type_graphql_1.InputType()
], AddUserInput);
exports.AddUserInput = AddUserInput;
