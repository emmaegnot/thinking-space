const request = require("supertest");
const {server, app} = require("../server/server");

test("Checks page is rendered with the correct title and icon", async () => {
    const res = await request(app).get("/"); // Make a request to server
    expect(res.statusCode).toBe(200); // Status code 200 indicates a successful request and response
    expect(res.text).toContain("<title>The Thinking Space | Home</title>"); // Checks dynamic title
    expect(res.text).toEqual(expect.stringContaining('<link rel="icon" href="/images/icon.png" sizes="64x64">')); // Check icon is included in response
});

test("Checks that cookie consent popup appears when no consent cookie is present", async () => {
    const res = await request(app).get("/");
    expect(res.text).toContain("const showPopup = true"); // On the first request, there should be a popup shown
    expect(res.text).toContain('<div id="cookiePopup"');
  });

test("should NOT show the cookie consent popup when the consent cookie is set", async () => {
    const res = await request(app)
    .get("/")
    .set("Cookie", ["consent=true"]); // Augment page so it thinks cookies have been accepted
    expect(res.text).toContain("const showPopup = false"); // Cookie popup should not be shown
    expect(res.text).not.toContain('<div id="cookiePopup"');
  });

afterAll(() => {
    server.close(); // Close the server after the tests are done
  });