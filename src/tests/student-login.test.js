const request = require("supertest");
const {server, app} = require("../server/server");

test("Checks page is rendered with the correct title and icon", async () => {
    const res = await request(app).get("/student_login"); // Make a request to server
    expect(res.statusCode).toBe(200); // Status code 200 indicates a successful request and response
    expect(res.text).toContain("<title>The Thinking Space | Student Login</title>"); // Checks dynamic title
    expect(res.text).toEqual(expect.stringContaining('<link rel="icon" href="/images/icon.png" sizes="64x64">')); // Check icon is included in response
});

test("Checks nav contains title and home link", async () => {
    const res = await request(app).get("/student_login"); // Make a request to server
    expect(res.status).toBe(200);
    expect(res.text).toContain('<li><a>THE THINKING SPACE</a></li>');
    expect(res.text).toContain('<li class="home" style="float: right;"><a href="/"><i class="fa-solid fa-house"></i></a></li>');
});

test("Checks the correct input fields exist", async () => {
    const res = await request(app).get("/student_login"); // Make a request to server
    expect(res.status).toBe(200);
    expect(res.text).toContain('<input type="text" placeholder="Enter your Name" id="name" name="name" required><br>');
    expect(res.text).toContain('<input type="text" placeholder="Enter Class Code" id="classcode" name="classcode" required><br>');
});

test("Checks that the form submits to /student_login when LOGIN is clicked", async () => {
    const res = await request(app).get("/student_login"); // Make a request to server
    expect(res.status).toBe(200);
    expect(res.text).toContain('method="POST" action="/student_login"');
});

test("Checks that the HOME button redirects to the home page", async () => {
    const res = await request(app).get("/student_login"); // Make a request to server
    expect(res.status).toBe(200);
    expect(res.text).toContain(`document.getElementById('backButton').addEventListener('click', function() {`);
    expect(res.text).toContain(`window.location.href = '/';`);
});

test("Checks footer contains the logo and motto", async () => {
    const res = await request(app).get("/student_login"); // Make a request to server
    expect(res.status).toBe(200);
    expect(res.text).toContain('<img class="logo" src="images/logo.png" alt="Raymer Enterprises Ltd"');
    expect(res.text).toContain('<span class="motto mouseM">With emotional health in mind</span>');
});

afterAll(() => {
    server.close(); // Close the server after the tests are done
});