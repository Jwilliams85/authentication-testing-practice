//integration tests - different from the unit tests (these test just a small part of your code)
//why inegration tests will be testing how different parts of the systems work in tandem 
//end-to-end tests

//3 libraries in particular:
//1. jest
//2. supertest -http assertions library
//3. cross-env - npm module that lets us deal with OS inconsistencies
//provide a uniform way of setting env variables across ALL OSes
//since setting and using env variables is different across OSes


//you can avoid polluting the development database by using a SEPARATE database for testing//thats why we create dbEnv
//when writing these tests, focus on testing your status codes, and what's being returned (JSON)
const request = require("supertest");
const server = require ("./server");
const db = require ("../database/dbConfig");
const testUser = { username: "testing", password: "testing"}

describe("server.js", () => {
    describe("GET request for weather", () => {
        it("should return a status code of 400 when not logged in", async () => {
            const res = await request(server).get("/api/weather")
            expect(res.status).toBe(400);
        })
        it("should return json", async() => {
            const res = await request(server).get("/api/weather")
            expect(res.type).toBe("application/json")
        })
    })
    describe("registering new user", () => {
        it("should return witth a status code of 201 when adding new user", async() => {
            await db("users").truncate()//clearing the tables
            const res = await request(server)
            .post("/api/auth/register")
            .send(testUser);
            expect(res.status).toBe(201)

        })
        it("should return a status of 500 with an invalid user", async() => {
            const res = await request(server)
            .post("/api/auth/register")
            .send({user:"test", pass: "test"});
            expect(res.status).toBe(500);

        })
    })
    describe("ligin with user", () => {
        it("should return a status code of 200 with test user", async () => {
            const res = await request(server)
            .post("/api/auth/login")
            .send(testUser);
            expect(res.status).toBe(200)
        })
        it("should return with a status coed of 401 when given a non-valid user", async () => {
            const res = await request(server)
            .post("/api/auth/login")
            .send({username:"does not exist", password:"does not exist"})
        })
    })
})