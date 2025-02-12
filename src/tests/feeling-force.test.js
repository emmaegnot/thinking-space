const request = require("supertest");
const {server, app} = require("../server/server");

test("Checks page is rendered with the correct title and icon", async () => {
    const res = await request(app).get("/feeling_force") // Make request to server
    expect(res.statusCode).toBe(200); // Status code 200 indicates a successful request and response
    expect(res.text).toContain("<title>The Thinking Space | Feeling Force</title>"); // Checks dynamic title
    expect(res.text).toEqual(expect.stringContaining('<link rel="icon" href="/images/icon.png" sizes="64x64">')); // Check icon is included in response
});

test("Checks nav contains title and home link", async () => {
    const res = await request(app).get("/feeling_force");
    expect(res.status).toBe(200);
    expect(res.text).toContain('<li><a>THE THINKING SPACE</a></li>');
    expect(res.text).toContain('<li class="home" style="float: right;"><a href="/"><i class="fa-solid fa-house"></i></a></li>');
});

test("Checks that an increase and decrease button both exist on the page", async () => {
    const res = await request(app).get("/feeling_force");
    expect(res.status).toBe(200);
    expect(res.text).toContain('<button onclick="decrease()">-</button>');
    expect(res.text).toContain('<button onclick="increase()">+</button>');
});

test("Checks that meter and arrow image both appear, and are the intended height", async () => {
    const res = await request(app).get("/feeling_force");
    expect(res.status).toBe(200);
    expect(res.text).toContain('<img id="meter" src="images/meter.jpg" width="150" height="130">'); // Meter Image
    expect(res.text).toContain('<img id="arrow" src="images/arrow.png" width="20" height="40">'); // Arrow Image
});

test("Checks form contains hidden input field for clickCount", async () => {
    const res = await request(app).get("/feeling_force");
    expect(res.status).toBe(200);
    expect(res.text).toContain('<input id="clickCountInput" name="clickCount" type="hidden" value="5" >');
});

test("Checks that the form submits to /next-force when NEXT is clicked", async () => {
    const res = await request(app).get("/feeling_force");
    expect(res.text).toContain('form id = \"form\" action=\"submit-force\" method=\"post\"'); // The response should contain code for submitting the form
});

test("Checks that clicking BACK submits to /previous-force", async () => {
    const res = await request(app).get("/feeling_force");
    expect(res.text).toContain('form action=\"/previous-force\" method=\"post\"'); // The response should contain code for going back to the choose shape page
});

test("Checks footer contains the logo and motto", async () => {
    const res = await request(app).get("/feeling_force");
    expect(res.status).toBe(200);
    expect(res.text).toContain('<img class="logo" src="images/logo.png" alt="Raymer Enterprises Ltd"');
    expect(res.text).toContain('<span class="motto mouseM">With emotional health in mind</span>');
});

afterAll(() => {
    server.close(); // Close the server after the tests are done
  });