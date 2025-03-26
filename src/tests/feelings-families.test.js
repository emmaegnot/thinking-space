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
    await agent.post("/submit-weighing");
    const res = await agent.get("/feelings_families");
    expect(res.status).toBe(200); // Status code 200 indicates a successful request and response
    expect(res.text).toContain("<title>The Thinking Space | Game</title>"); // Checks dynamic title
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
    await agent.post("/submit-weighing");
    const res = await agent.get("/feelings_families");
    expect(res.status).toBe(200);
    expect(res.text).toContain('<li><a>THE THINKING SPACE</a></li>');
    expect(res.text).toContain('<li class="home" style="float: right;"><a href="/"><i class="fa-solid fa-house"></i></a></li>');
});


test("check container wtih a house image is rendered", async () => {
    const agent = request.agent(app); // Creates a persistent session
    await agent.post("/student_login");
    await agent.post('/next-shape'); // Choose shape
    await agent.post('/next-colour'); // Choose colour
    await agent.post('/next-word'); // Choose word
    await agent.post('/next-additional') // Choose additional words
    await agent.post('/submit-force'); // Choose forceawait agent.post("/submit-mood");
    await agent.post("/submit-text");
    await agent.post("/submit-weighing");
    const res = await agent.get("/feelings_families");
    expect(res.text).toContain("<img class=\"logo\" id=\"houseImage\" src=\"images/house.png\" alt=\"house image\" style=\"width: 300px; height: auto;\">");
})

test("after clicking angry button, startGame is called", async () => {
    const agent = request.agent(app); // Creates a persistent session
    await agent.post("/student_login");
    await agent.post('/next-shape'); // Choose shape
    await agent.post('/next-colour'); // Choose colour
    await agent.post('/next-word'); // Choose word
    await agent.post('/next-additional') // Choose additional words
    await agent.post('/submit-force'); // Choose forceawait agent.post("/submit-mood");
    await agent.post("/submit-text");
    await agent.post("/submit-weighing");
    const res = await agent.get("/feelings_families");
    //ensure that when the button is clicked, it calls the startGame function with the correct word
    expect(res.text).toContain(`onclick="startGame('angry')"`);
});

test("after clicking any of the buttons, startGame is called", async () => {
    const agent = request.agent(app); // Creates a persistent session
    await agent.post("/student_login");
    await agent.post('/next-shape'); // Choose shape
    await agent.post('/next-colour'); // Choose colour
    await agent.post('/next-word'); // Choose word
    await agent.post('/next-additional') // Choose additional words
    await agent.post('/submit-force'); // Choose forceawait agent.post("/submit-mood");
    await agent.post("/submit-text");
    await agent.post("/submit-weighing");
    const res = await agent.get("/feelings_families");
    //ensure that when the button is clicked, it calls the startGame function with the correct word
    for (var word of Object.keys(words)) {
    expect(res.text).toContain(`onclick="startGame('${word.toLowerCase()}')"`);
    }
});

//test that after clicking one of the buttons,the canvas appears
test("after clicking one of the buttons, the canvas appears", async () => {
    const agent = request.agent(app); // Creates a persistent session
    await agent.post("/student_login");
    await agent.post('/next-shape'); // Choose shape
    await agent.post('/next-colour'); // Choose colour
    await agent.post('/next-word'); // Choose word
    await agent.post('/next-additional') // Choose additional words
    await agent.post('/submit-force'); // Choose forceawait agent.post("/submit-mood");
    await agent.post("/submit-text");
    await agent.post("/submit-weighing");
    const res = await agent.get("/feelings_families");
    // checking that there is javascript to make the canvas appear:
    expect(res.text).toContain('canvas : document.createElement("canvas")');
});

afterAll(() => {
    server.close(); // Close the server after the tests are done
  });