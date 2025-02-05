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
            .send('shape=' + selectedShape) // Sends the shape to the server
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

test("Checks if the color selection buttons are present", async () => {
    const res = await request(app).get("/choose_colour");
    // Checks that each colour is able to be selected as a button
    expect(res.text).toContain('type="button" name="colourValue" value="red"'); 
    expect(res.text).toContain('type="button" name="colourValue" value="orange"'); 
    expect(res.text).toContain('type="button" name="colourValue" value="green"');
    expect(res.text).toContain('type="button" name="colourValue" value="yellow"');
    expect(res.text).toContain('type="button" name="colourValue" value="blue"');
    expect(res.text).toContain('type="button" name="colourValue" value="black"');
});

test("Checks that NEXT button is initially disabled", async () => {
    const res = await request(app).get("/choose_shape");
    expect(res.text).toContain('<button type="submit" id="nextButton" disabled>NEXT</button>'); // Checks next button is initially disabled as no shape is selected
});

test("Checks that the form submits to /next-colour when NEXT is clicked", async () => {
    const res = await request(app).get("/choose_colour");
    expect(res.text).toContain("form.action = '/next-colour';"); // The response should contain code for submitting the form
});

afterAll(() => {
    server.close(); // Close the server after the tests are done
  });