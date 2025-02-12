const request = require("supertest");
const {server, app, shapes, colours, words} = require("../server/server");

test("Checks page is rendered with the correct title and icon", async () => {
    const res = await request(app).get("/mood_summary");
    expect(res.status).toBe(200); // Status code 200 indicates a successful request and response
    expect(res.text).toContain("<title>The Thinking Space | Mood Summary</title>"); // Checks dynamic title
    expect(res.text).toEqual(expect.stringContaining('<link rel="icon" href="/images/icon.png" sizes="64x64">')); // Check icon is included in response
});

test("Checks nav contains title and home link", async () => {
    const res = await request(app).get("/mood_summary");
    expect(res.status).toBe(200);
    expect(res.text).toContain('<li><a>THE THINKING SPACE</a></li>');
    expect(res.text).toContain('<li class="home" style="float: right;"><a href="/"><i class="fa-solid fa-house"></i></a></li>');
});

test("Checks page is rendered with a mood", async () => {
    const agent = request.agent(app); // Creates a persistent session
    await agent.post('/next-shape'); // Choose shape
    await agent.post('/next-colour'); // Choose colour
    await agent.post('/next-word'); // Choose word
    await agent.post('/submit-force'); // Choose force
    const res = await agent.get('/mood_summary'); // Get mood summary
    expect(res.status).toBe(200); // Status code 200 indicates a successful request and response
    expect(res.text).toContain("<h2>Are you feeling indecisive?</h2>"); // Checks the server assigns a mood
});

test("Checks page is rendered with a mood for every shape, colour, and word combination", async () => {
    const possibleMoods = ['friendly', 'comfortable', 'happy', 'dreamy', 'calm', 'connected', 'stable', 'confused', 'unstable', 'excited', 'angry', 'concerned', 'scared', 'irritated', 'isolated', 'sad', 'indecisive'] // Define all possible moods that our server can match to
    for (const shape of Object.keys(shapes)) { // For each shape
        for (const colour of Object.keys(colours)) { // For each colour
            for (const word of Object.keys(words)) { // For each word
                // Nested for loops mean every combination of shape, colour and word is tested
                const agent = request.agent(app);
                // Send the server all the data
                await agent.post('/next-shape').send("shape=" + shape);
                await agent.post('/next-colour').send("colour=" + colour );
                await agent.post('/next-word').send("selectedEmotion=" + word );
                await agent.post('/submit-force').send("clickCount=5");
                const res = await agent.get('/mood_summary');
                expect(res.status).toBe(200);
                // The mood should be in the possibleMoods array
                const containsValidMood = possibleMoods.some(mood => res.text.includes(`Are you feeling ${mood}?</h2>`));
                expect(containsValidMood).toBe(true); // Expect at least one match
            }
        }
    }
});

test("Checks that the selected mood persists across sessions", async () => {
    const agent = request.agent(app);
    // In server, the cloud shape, yellow and Happy are all associated with the mood 'happy'
    // There is no better fit, so it is guaranteed to match as happy
    // So we send this data and check that it matches correctly
    await agent.post('/next-shape').send("shape=cloud");
    await agent.post('/next-colour').send("colour=yellow");
    await agent.post('/next-word').send("selectedEmotion=Happy");
    await agent.post('/submit-force').send("clickCount=5");
    const res1 = await agent.get('/mood_summary');
    expect(res1.text).toContain("<h2>Are you feeling happy?</h2>");
    const res2 = await agent.get('/mood_summary'); // Revisit the page
    expect(res2.text).toContain("<h2>Are you feeling happy?</h2>"); // The mood should persist, even though the user makes another get request to the page
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