import request from 'supertest';
import { jest } from '@jest/globals'
import app from '../server';

//mock fetch request using mock data for response
global.fetch = jest.fn(() =>{
    console.log('Mock fetch called');
  return Promise.resolve({
    json: () => Promise.resolve({results: {
            "coord": {
              "lon": -0.13,
              "lat": 51.51
            },
            "weather": [
              {
                "id": 300,
                "main": "Drizzle",
                "description": "light intensity drizzle",
                "icon": "09d"
              }
            ],
            "base": "stations",
            "main": {
              "temp": 280.32,
              "pressure": 1012,
              "humidity": 81,
              "temp_min": 279.15,
              "temp_max": 281.15
            },
            "visibility": 10000,
            "wind": {
              "speed": 4.1,
              "deg": 80
            },
            "clouds": {
              "all": 90
            },
            "dt": 1485789600,
            "sys": {
              "type": 1,
              "id": 5091,
              "message": 0.0103,
              "country": "GB",
              "sunrise": 1485762037,
              "sunset": 1485794875
            },
            "id": 2643743,
            "name": "London",
            "cod": 200    
        }})
    })
  })

describe('GET /api/weather', () => {
 
     afterEach(() => {
    // Clear the mock after each test
    jest.clearAllMocks(); 
  });
  it('should return status 200 and a list of items', async () => {
    const response = await request(app).get('/api/weather');
    //console.log('Actual Response:', JSON.stringify(response.body));
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expect.arrayContaining([/* expected items */]));
    expect(fetch).toHaveBeenCalledTimes(1)
    });
  });