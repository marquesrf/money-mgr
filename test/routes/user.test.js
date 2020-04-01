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

// Using async await
test("Must NOT insert a user without a email", async () => {
  const result = await request(app)
    .post("/users")
    .send({ name: "Walter Mitty", passwd: "123456" });
  expect(result.status).toBe(400);
  expect(result.body.error).toBe("The 'mail' attribute is mandatory!");
});

// Using done
test("Must NOT insert a user without a password", done => {
  const mail = `${Date.now()}@mail.com`;
  request(app)
    .post("/users")
    .send({ name: "Walter Mitty", mail })
    .then(res => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("The 'passwd' attribute is mandatory!");
      done();
    })
    .catch(err => done.fail(err));
});
