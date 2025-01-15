import {generaliseColour} from '../server/server.js'

test('Tests #ff0000 returns red', () => {
    expect(generaliseColour('#ff00000')).toBe("red")
})