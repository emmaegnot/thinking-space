const request = require("supertest");
const {server, app, shapes, colours, words, additionalWords} = require("../server/server");

test("Checks page is rendered with the correct title and icon", async () => {
    const agent = request.agent(app); // Creates a persistent session
    await agent.post('/student_login');
    await agent.post("/next-shape");
    await agent.post("/next-colour");
    await agent.post("/next-word");
    await agent.post("/next-additional");
    await agent.post("/submit-force");
    await agent.post("/submit-mood");
    await agent.post("/submit-text");
    const res = await agent.get("/weighing_things_up");
    expect(res.status).toBe(200); // Status code 200 indicates a successful request and response
    expect(res.text).toContain("<title>The Thinking Space | Weighing Things Up</title>"); // Checks dynamic title
    expect(res.text).toEqual(expect.stringContaining('<link rel="icon" href="/images/icon.png" sizes="64x64">')); // Check icon is included in response
});

test("Checks nav contains title and home link", async () => {
    const agent = request.agent(app); // Creates a persistent session
    await agent.post('/student_login');
    await agent.post("/next-shape");
    await agent.post("/next-colour");
    await agent.post("/next-word");
    await agent.post("/next-additional");
    await agent.post("/submit-force");
    await agent.post("/submit-mood");
    await agent.post("/submit-text");
    const res = await agent.get("/weighing_things_up");
    expect(res.status).toBe(200); // Status code 200 indicates a successful request and response
    expect(res.text).toContain('<li><a>THE THINKING SPACE</a></li>');
    expect(res.text).toContain('<li class="home" style="float: right;"><a href="/"><i class="fa-solid fa-house"></i></a></li>');
});

test("Checks that both a good and bad text area exist", async () => {
    const agent = request.agent(app); // Creates a persistent session
    await agent.post('/student_login');
    await agent.post("/next-shape");
    await agent.post("/next-colour");
    await agent.post("/next-word");
    await agent.post("/next-additional");
    await agent.post("/submit-force");
    await agent.post("/submit-mood");
    await agent.post("/submit-text");
    const res = await agent.get("/weighing_things_up");
    expect(res.text).toContain('<textarea onchange="updateBalance()" id="good" rows="5" cols="50" style="width:100%"></textarea>');
    expect(res.text).toContain('<textarea onchange="updateBalance()" id="bad"  rows="5" cols="50" style="width:100%"></textarea>');
});

test("Checks that the form submits to /submit-what when NEXT is clicked", async () => {
    const agent = request.agent(app); // Creates a persistent session
    await agent.post('/student_login');
    await agent.post("/next-shape");
    await agent.post("/next-colour");
    await agent.post("/next-word");
    await agent.post("/next-additional");
    await agent.post("/submit-force");
    await agent.post("/submit-mood");
    await agent.post("/submit-text");
    const res = await agent.get("/weighing_things_up");
    expect(res.text).toContain('action="/submit-what"'); // The response should contain code for submitting the form
});

test("Checks that clicking BACK submits to /back-to-what-happened", async () => {
    const agent = request.agent(app); // Creates a persistent session
    await agent.post('/student_login');
    await agent.post("/next-shape");
    await agent.post("/next-colour");
    await agent.post("/next-word");
    await agent.post("/next-additional");
    await agent.post("/submit-force");
    await agent.post("/submit-mood");
    await agent.post("/submit-text");
    const res = await agent.get("/weighing_things_up");
    expect(res.text).toContain('action="/back-to-what-happened"'); // The response should contain code for going back to the choose shape page
});

test("Checks footer contains the logo and motto", async () => {
    const agent = request.agent(app); // Creates a persistent session
    await agent.post('/student_login');
    await agent.post("/next-shape");
    await agent.post("/next-colour");
    await agent.post("/next-word");
    await agent.post("/next-additional");
    await agent.post("/submit-force");
    await agent.post("/submit-mood");
    await agent.post("/submit-text");
    const res = await agent.get("/weighing_things_up");
    expect(res.status).toBe(200); // Status code 200 indicates a successful request and response
    expect(res.text).toContain('<img class="logo" src="images/logo.png" alt="Raymer Enterprises Ltd"');
    expect(res.text).toContain('<span class="motto mouseM">With emotional health in mind</span>');
});

afterAll(() => {
    server.close(); // Close the server after the tests are done
  });