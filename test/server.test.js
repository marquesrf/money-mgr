const supertest = require("supertest");

const request = supertest("http://localhost:3001");

test("Server must listen on port 3001", () => {
  // Access url http://localhost:3001
  // Returned status code must be 200
  return request.get("/").then(res => expect(res.status).toBe(200));
});
