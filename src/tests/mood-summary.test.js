const request = require("supertest");
const {server, app} = require("../server/server");

test("Checks page is rendered with the correct title and icon", async () => {
    // const agent = request.agent(app); // Creates a persistent session
    // await agent.post('/next-shape').send({ shape: 'circle' }); // Choose shape
    // await agent.post('/next-colour').send({ colour: 'blue' }); // Choose colour
    // await agent.post('/next-word').send({ selectedEmotion: 'Happy' }); // Choose word
    // await agent.post('/submit-force').send({ clickCount: 7 }); // Choose force
    // const res = await agent.get('/mood_summary'); // Get mood summary
    const res = await request(app).get("/mood_summary");
    expect(res.status).toBe(200); // Status code 200 indicates a successful request and response
    expect(res.text).toContain("<title>The Thinking Space | Mood Summary</title>"); // Checks dynamic title
});

afterAll(() => {
    server.close(); // Close the server after the tests are done
  });