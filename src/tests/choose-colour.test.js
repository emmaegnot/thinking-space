const request = require("supertest");
const {server, app} = require("../server/server");

test("Checks page is rendered with the correct title and icon", async () => {
    const res = await request(app).get("/choose_colour") // Make request to server
    expect(res.statusCode).toBe(200); // Status code 200 indicates a successful request and response
    expect(res.text).toContain("<title>The Thinking Space | Choose A Colour</title>"); // Checks dynamic title
    expect(res.text).toEqual(expect.stringContaining('<link rel="icon" href="/images/icon.png" sizes="64x64">')); // Check icon is included in response
});

test.each(["parallelogram", "circle", "square", "star", "triangle", "spikeyball", "cloud", "hexagon"])(
    "Checks that only the selected shape appears as an image",
    async (selectedShape) => {
        const agent = request.agent(app); // Creates a persistent session
        await agent
            .post("/next-shape") // Send a post request
            .send({ shape: selectedShape }) // Send the selected shape as data
            .expect(302) // Indicates a redirect
        const res = await agent.get("/choose_colour"); // Make a request to choose_colour
        expect(res.statusCode).toBe(200);
        expect(res.text).toContain(`images/${selectedShape}.png`); // Checks the dislpayed image matches the selected shape
        const otherShapes = ["parallelogram", "circle", "square", "star", "triangle", "spikeyball", "cloud", "hexagon"].filter(shape => shape !== selectedShape);
        otherShapes.forEach(shape => {
            expect(res.text).not.toContain(`images/${shape}.png`); // Checks no other shapes are present
        });
    }
);

afterAll(() => {
    server.close(); // Close the server after the tests are done
  });