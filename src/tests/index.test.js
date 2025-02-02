const request = require("supertest");
const { app } = require("../server");

test("Checks page is rendered with the correct title", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain("<title>The Thinking Space | Home</title>");
});

afterAll(() => {
    server.close(); // Close the server after the tests are done
  });