const request = require("supertest");
const app = require("../src/app");

test("Must return root", () => {
  return request(app)
    .get("/")
    .then(res => {
      expect(res.status).toBe(200);
    });
});
