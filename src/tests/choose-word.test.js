const request = require("supertest");
const {server, app} = require("../server/server");

test("Checks page is rendered with the correct title and icon", async () => {
    const agent = request.agent(app); // Creates a persistent session
    await agent.post('/student_login');
    await agent.post("/next-shape");
    await agent.post("/next-colour");
    const res = await agent.get("/choose_word") // Make request to server
    expect(res.statusCode).toBe(200); // Status code 200 indicates a successful request and response
    expect(res.text).toContain("<title>The Thinking Space | Choose A Word</title>"); // Checks dynamic title
    expect(res.text).toEqual(expect.stringContaining('<link rel="icon" href="/images/icon.png" sizes="64x64">')); // Check icon is included in response
});

test("Checks nav contains title and home link", async () => {
    const agent = request.agent(app); // Creates a persistent session
    await agent.post('/student_login');
    await agent.post("/next-shape");
    await agent.post("/next-colour");
    const res = await agent.get("/choose_word") // Make request to server
    expect(res.status).toBe(200);
    expect(res.text).toContain('<li><a>THE THINKING SPACE</a></li>');
    expect(res.text).toContain('<li class="home" style="float: right;"><a href="/"><i class="fa-solid fa-house"></i></a></li>');
});

test("Checks that NEXT button is initially disabled", async () => {
    const agent = request.agent(app); // Creates a persistent session
    await agent.post('/student_login');
    await agent.post("/next-shape");
    await agent.post("/next-colour");
    const res = await agent.get("/choose_word") // Make request to server
    expect(res.text).toContain('<button type="submit" id="nextButton" disabled>NEXT</button>'); // Checks next button is initially disabled as no shape is selected
});

test("Checks that the form submits to /next-word when NEXT is clicked", async () => {
    const agent = request.agent(app); // Creates a persistent session
    await agent.post('/student_login');
    await agent.post("/next-shape");
    await agent.post("/next-colour");
    const res = await agent.get("/choose_word") // Make request to server
    expect(res.text).toContain("form.action = '/next-word';"); // The response should contain code for submitting the form
});

test("Checks that clicking BACK submits to /previous-word", async () => {
    const agent = request.agent(app); // Creates a persistent session
    await agent.post('/student_login');
    await agent.post("/next-shape");
    await agent.post("/next-colour");
    const res = await agent.get("/choose_word") // Make request to server
    expect(res.text).toContain("form.action = '/previous-word';"); // The response should contain code for going back to the choose shape page
});

test("Checks if the word selection buttons are present", async () => {
    const agent = request.agent(app); // Creates a persistent session
    await agent.post('/student_login');
    await agent.post("/next-shape");
    await agent.post("/next-colour");
    const res = await agent.get("/choose_word") // Make request to server
    // Checks that each emotion is able to be selected as a button
    const emotions = ["Angry", "Disgusted", "Fearful", "Happy", "Sad", "Surprised"];
    emotions.forEach(emotion => {
        expect(res.text).toContain(`<button type="button" name="emotion" value="${emotion}" onclick="highlightButton(this)">`); // For each emotion, check the response contains an input field with its name
    });
});

test("Checks footer contains the logo and motto", async () => {
    const agent = request.agent(app); // Creates a persistent session
    await agent.post('/student_login');
    await agent.post("/next-shape");
    await agent.post("/next-colour");
    const res = await agent.get("/choose_word") // Make request to server
    expect(res.status).toBe(200);
    expect(res.text).toContain('<img class="logo" src="images/logo.png" alt="Raymer Enterprises Ltd"');
    expect(res.text).toContain('<span class="motto mouseM">With emotional health in mind</span>');
});

afterAll(() => {
    server.close(); // Close the server after the tests are done
  });