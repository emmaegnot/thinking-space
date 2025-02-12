const request = require("supertest");
const {server, app} = require("../server/server");

test("Checks page is rendered with the correct title and icon", async () => {
    const res = await request(app).get("/choose_shape"); // Make a request to server
    expect(res.statusCode).toBe(200); // Status code 200 indicates a successful request and response
    expect(res.text).toContain("<title>The Thinking Space | Choose A Shape</title>"); // Checks dynamic title
    expect(res.text).toEqual(expect.stringContaining('<link rel="icon" href="/images/icon.png" sizes="64x64">')); // Check icon is included in response
});

test("Checks nav contains title and home link", async () => {
    const res = await request(app).get("/choose_shape");
    expect(res.status).toBe(200);
    expect(res.text).toContain('<li><a>THE THINKING SPACE</a></li>');
    expect(res.text).toContain('<li class="home" style="float: right;"><a href="/"><i class="fa-solid fa-house"></i></a></li>');
});

test("Checks that all shape options are present", async () => {
    const res = await request(app).get("/choose_shape");
    const shapes = ["parallelogram", "circle", "square", "star", "triangle", "spikeyball", "cloud", "hexagon"];
    shapes.forEach(shape => {
        expect(res.text).toContain(`value="${shape}"`); // For each shape, check the response contains an input field with its name
    });
});

test("Checks that NEXT button is initially disabled", async () => {
    const res = await request(app).get("/choose_shape");
    expect(res.text).toContain('<button type="submit" id="nextButton" disabled>NEXT</button>'); // Checks next button is initially disabled as no shape is selected
});

test("Checks that the form submits to /next-shape when NEXT is clicked", async () => {
    const res = await request(app).get("/choose_shape");
    expect(res.text).toContain("form.action = '/next-shape';"); // The response should contain code for submitting the form
});

test("Checks footer contains the logo and motto", async () => {
    const res = await request(app).get("/mood_summary");
    expect(res.status).toBe(200);
    expect(res.text).toContain('<img class="logo" src="images/logo.png" alt="Raymer Enterprises Ltd"');
    expect(res.text).toContain('<span class="motto mouseM">With emotional health in mind</span>');
});

afterAll(() => {
    server.close(); // Close the server after the tests are done
  });