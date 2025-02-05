const request = require("supertest");
const {server, app} = require("../server/server");

test("Checks page is rendered with the correct title and icon", async () => {
    const res = await request(app).get("/choose_shape");
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain("<title>The Thinking Space | Choose A Shape</title>");
    expect(res.text).toEqual(expect.stringContaining('<link rel="icon" href="/images/icon.png" sizes="64x64">'));
});

test("Checks that all shape options are present", async () => {
    const res = await request(app).get("/choose_shape");
    const shapes = ["parallelogram", "circle", "square", "star", "triangle", "spikeyball", "cloud", "hexagon"];
    shapes.forEach(shape => {
        expect(res.text).toContain(`value="${shape}"`);
    });
});

afterAll(() => {
    server.close(); // Close the server after the tests are done
  });