const request = require("supertest");
const { app } = require("../server");

test("Checks page is rendered with the correct title", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain("<title>The Thinking Space | Home</title>");
});

test("Checks that cookie consent popup appears when no consent cookie is present", async () => {
    const res = await request(app).get("/");
    expect(res.text).toContain("const showPopup = true");
    expect(res.text).toContain('<div id="cookiePopup"');
  });

test("should NOT show the cookie consent popup when the consent cookie is set", async () => {
    const res = await request(app)
    .get("/")
    .set("Cookie", ["consent=true"]);
    expect(res.text).toContain("const showPopup = false");
    expect(res.text).not.toContain('<div id="cookiePopup"');
  });

afterAll(() => {
    server.close(); // Close the server after the tests are done
  });