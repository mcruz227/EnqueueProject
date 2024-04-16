/**
 * @jest-environment jsdom
 */


const { chrome } = require('jest-chrome');

global.chrome = chrome;

const enqueue = require('../enqueue'); // Assuming myModule.js is in the same directory


const test_url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'

test('extractVideoID extracts the correct ID', () =>{

    result = enqueue.extractVideoID(test_url)
    expect(result).toBe('dQw4w9WgXcQ')
})

test('isValidYouTubeURL detects correct url', () =>{
    result = enqueue.isValidYouTubeURL(test_url)
    expect(result).toBe(true)
})

test('isValidYouTubeURL detects incorrect URL', () =>{
    result = enqueue.isValidYouTubeURL("https://www.facebook.com")
    expect(result).toBe(false)
})

jest.spyOn(window, 'open'); // Mock the window.open method
//The spyOn gives a console error due to the mocking not being implemented in another library. 
//Just supressing the error for now. 
jest.spyOn(console, 'error').mockImplementationOnce(() => jest.fn()); // Supressing console error
test('openVideoInTab opens window', () => {
    const mockVideoId = '1234567890';
    enqueue.openVideoInTab(mockVideoId);
    
    expect(window.open).toHaveBeenCalledWith(`https://www.youtube.com/watch?v=${mockVideoId}`, '_blank'); // Assertions on mocked function call
  
});


//Storage Mocking

let localStorage = {}

beforeAll(() => {
  global.chrome.storage.local.set = jest.fn((key, value) => {
    localStorage[key] = value
  })
  global.chrome.storage.local.get = jest.fn((key) => localStorage[key])
})

beforeEach(() => {
  // make sure the fridge starts out empty for each test
  localStorage = {}
})

afterAll(() => {
  // return our mocks to their original values
  // 🚨 THIS IS VERY IMPORTANT to avoid polluting future tests!
  global.chrome.storage.local.set.mockReset()
  global.chrome.storage.local.get.mockReset()
})

test('new Storage Test', async () => {
    const mockVideos = [
      { channel: 'Channel 1', thumbnail: 'thumbnail.jpg', title: 'Video Title 1', videoId: '12345' },
      { channel: 'Channel 2', thumbnail: 'thumbnail2.jpg', title: 'Video Title 2', videoId: '67890' },
    ];
    const mockConsoleLog = jest.spyOn(console, 'log'); // Mock console.log
    const mockCallback = jest.fn(); // Mock the callback function

    localStorage = {videos : mockVideos}

    chrome.storage.local.get.mockImplementation(
        (mockStorage, callback) => {
          callback(mockVideos)
        },
    )

    enqueue.getVideoLinks(mockCallback)

    expect(global.chrome.storage.local.get).toHaveBeenCalled()

  });

  test('Save storage Test', async () => {
    const mockVideo = [
      { channel: 'Channel 1', thumbnail: 'thumbnail.jpg', title: 'Video Title 1', videoId: '12345' },
    ];
    const mockConsoleLog = jest.spyOn(console, 'log'); // Mock console.log
    const mockCallback = jest.fn(); // Mock the callback function

    localStorage = {videos : []}

    
    enqueue.saveVideoData(mockVideo)
    console.log("Curent local storage", localStorage)

    expect(chrome.storage.local.get).toHaveBeenCalled()
    expect(localStorage['videos']).toEqual(mockVideo)

  });


