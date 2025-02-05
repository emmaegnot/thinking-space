const request = require("supertest");
const {server, app} = require("../server/server");

afterAll(() => {
    server.close(); // Close the server after the tests are done
  });