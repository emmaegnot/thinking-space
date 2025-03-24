const request = require("supertest");
const {server, app, additionalWords, words} = require("../server/server");

test("Checks page is rendered with the correct title and icon", async () => {
    const agent = request.agent(app); // Creates a persistent session
    await agent.post('/student_login');
    await agent.post("/next-shape");
    await agent.post("/next-colour");
    await agent.post('/next-word').send("selectedEmotion=Happy");
    const res = await agent.get("/additional_words") // Make request to server
    expect(res.statusCode).toBe(200); // Status code 200 indicates a successful request and response
    expect(res.text).toContain("<title>The Thinking Space | More Words</title>"); // Checks dynamic title
    expect(res.text).toEqual(expect.stringContaining('<link rel="icon" href="/images/icon.png" sizes="64x64">')); // Check icon is included in response
});

test("Checks nav contains title and home link", async () => {
    const agent = request.agent(app); // Creates a persistent session
    await agent.post('/student_login');
    await agent.post("/next-shape");
    await agent.post("/next-colour");
    await agent.post('/next-word').send("selectedEmotion=Happy");
    const res = await agent.get("/additional_words") // Make request to server
    expect(res.statusCode).toBe(200); // Status code 200 indicates a successful request and response
    expect(res.text).toContain('<li><a>THE THINKING SPACE</a></li>');
    expect(res.text).toContain('<li class="home" style="float: right;"><a href="/"><i class="fa-solid fa-house"></i></a></li>');
});

test("Checks each word selected on the previous page leads to the correct additional words being displayed", async () => {
    const agent = request.agent(app); // Creates a persistent session
    for(const word of Object.keys(words)){
        await agent.post('/student_login');
        await agent.post("/next-shape");
        await agent.post("/next-colour");
        await agent.post('/next-word').send("selectedEmotion=" + word );
        const res = await agent.get("/additional_words") // Make request to server
        expect(res.status).toBe(200);
        for (const addWord of additionalWords[word]) {
            expect(res.text).toContain(`type="checkbox" name="words" value="${addWord}"`); // // For each additional word, check it can be selected
        }
    }
});

test("Checks that NEXT button is initially disabled", async () => {
    const agent = request.agent(app); // Creates a persistent session
    await agent.post('/student_login');
    await agent.post("/next-shape");
    await agent.post("/next-colour");
    await agent.post('/next-word').send("selectedEmotion=Happy");
    const res = await agent.get("/additional_words") // Make request to server
    expect(res.text).toContain('<button type="button" id="nextButton" disabled>NEXT</button>'); // Checks next button is initially disabled as no additional words are selected
});

test("Checks that the form submits to /next-additional when NEXT is clicked", async () => {
    const agent = request.agent(app); // Creates a persistent session
    await agent.post('/student_login');
    await agent.post("/next-shape");
    await agent.post("/next-colour");
    await agent.post('/next-word').send("selectedEmotion=Happy");
    const res = await agent.get("/additional_words") // Make request to server
    expect(res.text).toContain("form.action = '/next-additional';"); // The response should contain code for submitting the form
});

test("Checks that clicking BACK submits to /previous-additional", async () => {
    const agent = request.agent(app); // Creates a persistent session
    await agent.post('/student_login');
    await agent.post("/next-shape");
    await agent.post("/next-colour");
    await agent.post('/next-word').send("selectedEmotion=Happy");
    const res = await agent.get("/additional_words") // Make request to server
    expect(res.text).toContain("form.action = '/previous-additional'"); // The response should contain code for going back to the choose word page
});

test("Checks footer contains the logo and motto", async () => {
    const agent = request.agent(app); // Creates a persistent session
    await agent.post('/student_login');
    await agent.post("/next-shape");
    await agent.post("/next-colour");
    await agent.post('/next-word').send("selectedEmotion=Happy");
    const res = await agent.get("/additional_words") // Make request to server
    expect(res.statusCode).toBe(200); // Status code 200 indicates a successful request and response
    expect(res.text).toContain('<img class="logo" src="images/logo.png" alt="Raymer Enterprises Ltd"');
    expect(res.text).toContain('<span class="motto mouseM">With emotional health in mind</span>');
});

afterAll(() => {
    server.close(); // Close the server after the tests are done
});