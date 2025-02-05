// const {generaliseColour, server} = require('../server/server');

// test('Tests base colours', () => {
//     // Tests that each base/defined colour is what it is expected to be
//     expect(generaliseColour('rgba(255,0,0,1)')).toBe("red");
//     expect(generaliseColour('rgba(255,165,0,1)')).toBe("orange");
//     expect(generaliseColour('rgba(255,255,0,1)')).toBe("yellow");
//     expect(generaliseColour('rgba(0,255,0,1)')).toBe("green");
//     expect(generaliseColour('rgba(0,0,255,1)')).toBe("blue");
//     expect(generaliseColour('rgba(255,192,203,1)')).toBe("pink");
//     expect(generaliseColour('rgba(128,0,128,1)')).toBe("purple");
//     expect(generaliseColour('rgba(0,0,0,1)')).toBe("black");
//     expect(generaliseColour('rgba(255,255,255,1)')).toBe("white");
// });

// test('Test non-base colours', () => {
//     // Non-base colours should be their expected colour
//     expect(generaliseColour('rgba(255,128,128,1)')).toBe("pink");
//     expect(generaliseColour('rgba(128,204,0,1)')).toBe("orange");
//     expect(generaliseColour('rgba(0,0,128,1)')).toBe("blue");
// });

// test('Test random colours', () => {
//     const randomBetween = (min, max) => min + Math.floor(Math.random() * (max - min + 1)); // Define function for choosing a random colour between min and mix
//     const predefinedColors = ["red", "orange", "yellow", "green", "blue", "pink", "purple", "black", "white"];
//     for (let i = 0; i < 1000; i++) {
//         // Choose 1000 random rgb values
//         const r = randomBetween(0, 255);
//         const g = randomBetween(0, 255);
//         const b = randomBetween(0, 255);
//         const rgb = `rgba(${r},${g},${b}, 1)`; // Format the rgb code, 1 is the 'a' value, so fully visible
//         const result = generaliseColour(rgb);
//         expect(predefinedColors).toContain(result); // A colour should be matched for every random rgb code
//     }
// });

// afterAll(() => {
//     server.close(); // Close the server after the tests are done
//   });