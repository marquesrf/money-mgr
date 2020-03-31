const request = require("supertest");
const app = require("../src/app");

test("Must list all users", () => {
  return request(app)
    .get("/users")
    .then(res => {
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0]).toHaveProperty("name", "John Doe");
    });
});

test("Must insert a user", () => {
  return request(app)
    .post("/users")
    .send({ name: "Walter Mitty", mail: "walter@mail.com" })
    .then(res => {
      expect(res.status).toBe(201);
      expect(res.body.name).toBe("Walter Mitty");
    });
});
