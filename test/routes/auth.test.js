const request = require("supertest");
const app = require("../../src/app");

test("Must create user through signup", () => {
  return request(app)
    .post("/auth/signup")
    .send({ name: "Walter", mail: `${Date.now()}@mail.com`, passwd: "123456" })
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body.name).toBe("Walter");
      expect(res.body).toHaveProperty("mail");
      expect(res.body).not.toHaveProperty("passwd");
    });
});

test("Must receive a token on login", () => {
  const mail = `${Date.now()}@mail.com`;
  return app.services.user
    .save({ name: "Walter", mail: mail, passwd: "123456" })
    .then(() =>
      request(app).post("/auth/signin").send({ mail, passwd: "123456" })
    )
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("token");
    });
});

test("Must NOT authenticate user with wrong mail", () => {
  return request(app)
    .post("/auth/signin")
    .send({ mail: "noExist@test.com", passwd: "654321" })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Wrong username or password!");
    });
});

test("Must NOT authenticate user with wrong password", () => {
  const mail = `${Date.now()}@mail.com`;
  return app.services.user
    .save({ name: "Walter", mail: mail, passwd: "123456" })
    .then(() =>
      request(app).post("/auth/signin").send({ mail, passwd: "654321" })
    )
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Wrong username or password!");
    });
});

test("Must NOT access protected a route without a token", () => {
  return request(app)
    .get("/users")
    .then((res) => {
      expect(res.status).toBe(401);
    });
});
