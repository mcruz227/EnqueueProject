/**
 * @jest-environment jsdom
 */


const enqueue = require('../enqueue')
const { mockRuntime, mockStorage } = require('jest-chrome');

const test_url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'

test('URL ID Extraction', () =>{
    expect(extractVideoID(test_url)).toBe(dQw4w9WgXcQ)
})

test('Valid URL', () =>{
    expect(isValidYouTubeURL(test_url)).toBe(true)
})

test('use jsdom in this test file', () => {
    const element = document.createElement('div');
    expect(element).not.toBeNull();
  });