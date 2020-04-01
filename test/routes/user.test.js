const request = require("supertest");
const app = require("../../src/app");

test("Must list all users", () => {
  return request(app)
    .get("/users")
    .then(res => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
    });
});

test("Must insert a user", () => {
  const mail = `${Date.now()}@mail.com`;
  return request(app)
    .post("/users")
    .send({ name: "Walter Mitty", mail, passwd: "123456" })
    .then(res => {
      expect(res.status).toBe(201);
      expect(res.body.name).toBe("Walter Mitty");
    });
});

test("Must NOT insert a user without a name", () => {
  const mail = `${Date.now()}@mail.com`;
  return request(app)
    .post("/users")
    .send({ mail, passwd: "123456" })
    .then(res => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("The 'name' attribute is mandatory!");
    });
});
