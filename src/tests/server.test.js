const {generaliseColour, server} = require('../server/server');

test('Tests base colours', () => {
    expect(generaliseColour('#ff0000')).toBe("red");
    expect(generaliseColour('#ffa500')).toBe("orange");
    expect(generaliseColour('#ffff00')).toBe("yellow");
    expect(generaliseColour('#00ff00')).toBe("green");
    expect(generaliseColour('#0000ff')).toBe("blue");
    expect(generaliseColour('#ffc0cb')).toBe("pink");
    expect(generaliseColour('#800080')).toBe("purple");
    expect(generaliseColour('#000000')).toBe("black");
    expect(generaliseColour('#ffffff')).toBe("white");
});

test('Test non-base colours', () => {
    expect(generaliseColour('#ff8080')).toBe("pink");
    expect(generaliseColour('#80cc00')).toBe("orange");
    expect(generaliseColour('#000080')).toBe("blue");
});

test('Test random colours', () => {
    const randomBetween = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
    const toHex = (value) => value.toString(16).padStart(2, '0');
    const predefinedColors = ["red", "orange", "yellow", "green", "blue", "pink", "purple", "black", "white"];
    for (let i = 0; i < 1000; i++) {
        const r = randomBetween(0, 255);
        const g = randomBetween(0, 255);
        const b = randomBetween(0, 255);
        const rgb = `#${toHex(r)},${toHex(g)},${toHex(b)})`;
        const result = generaliseColour(rgb);
        expect(predefinedColors).toContain(result)
    }
});

afterAll(() => {
    server.close(); // Close the server after the tests are done
  });