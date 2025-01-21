const {generaliseColour, server} = require('../server/server');

test('Tests base colours', () => {
    expect(generaliseColour('#ff0000')).toBe("red")
    expect(generaliseColour('#ffa500')).toBe("orange")
    expect(generaliseColour('#ffff00')).toBe("yellow")
    expect(generaliseColour('#00ff00')).toBe("green")
    expect(generaliseColour('#0000ff')).toBe("blue")
    expect(generaliseColour('#ffc0cb')).toBe("pink")
    expect(generaliseColour('#800080')).toBe("purple")
    expect(generaliseColour('#000000')).toBe("black")
    expect(generaliseColour('#ffffff')).toBe("white")
})

test('Test non-base colours', () => {
    expect(generaliseColour('#ff6464')).toBe("") // Light red
    expect(generaliseColour('#80cc00')).toBe("green") // Lime green
    expect(generaliseColour('#000080')).toBe("blue") // Dark blue
})

afterAll(() => {
    server.close(); // Close the server after the tests are done
  });