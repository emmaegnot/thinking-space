const request = require("supertest");
const {server, app} = require("../server/server");

test("Checks page is rendered with the correct title and icon", async () => {
    const res = await request(app) // Make request to server
    .get("/choose_colour")
    expect(res.statusCode).toBe(200); // Status code 200 indicates a successful request and response
    expect(res.text).toContain("<title>The Thinking Space | Choose A Colour</title>"); // Checks dynamic title
    expect(res.text).toEqual(expect.stringContaining('<link rel="icon" href="/images/icon.png" sizes="64x64">'));
});

afterAll(() => {
    server.close(); // Close the server after the tests are done
  });