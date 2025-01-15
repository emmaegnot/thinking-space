const {generaliseColour, server} = require('../server/server');

test('Tests base colours', () => {
    expect(generaliseColour('#ff0000')).toBe("red")
    expect(generaliseColour('#00ff00')).toBe("green")
    expect(generaliseColour('#0000ff')).toBe("blue")
})

afterAll(() => {
    server.close(); // Close the server after the tests are done
  });