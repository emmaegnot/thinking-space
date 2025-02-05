const request = require("supertest");
const {server, app} = require("../server/server");

test("Checks page is rendered with the correct title", async () => {
    const res = await request(app).get("/choose_shape");
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain("<title>The Thinking Space | Choose A Shape</title>");
});

afterAll(() => {
    server.close(); // Close the server after the tests are done
  });