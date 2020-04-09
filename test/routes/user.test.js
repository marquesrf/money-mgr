const request = require("supertest");
const jwt = require("jwt-simple");

const app = require("../../src/app");

const mail = `${Date.now()}@mail.com`;

let user;

beforeAll(async () => {
  const res = await app.services.user.save({
    name: "Walter Mitty",
    mail: `${Date.now()}@mail.com`,
    passwd: "123456",
  });
  user = { ...res[0] };
  user.token = jwt.encode(user, "s3cr3t");
});

test("Must list all users", () => {
  return request(app)
    .get("/users")
    .set("authorization", `bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body).not.toHaveProperty("passwd");
    });
});

test("Must insert a user", () => {
  return request(app)
    .post("/users")
    .send({ name: "Walter Mitty", mail, passwd: "123456" })
    .set("authorization", `bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body.name).toBe("Walter Mitty");
      expect(res.body).not.toHaveProperty("passwd");
    });
});

test("Must store encrypted password", async () => {
  const res = await request(app)
    .post("/users")
    .send({
      name: "Walter Mitty",
      mail: `${Date.now()}@mail.com`,
      passwd: "123456",
    })
    .set("authorization", `bearer ${user.token}`);
  expect(res.status).toBe(201);
  const { id } = res.body;
  const userDB = await app.services.user.findOne({ id });
  expect(userDB.passwd).not.toBeUndefined();
  expect(userDB.passwd).not.toBe("123456");
});

test("Must NOT insert a user without a name", () => {
  return request(app)
    .post("/users")
    .send({ mail, passwd: "123456" })
    .set("authorization", `bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("The 'name' attribute is mandatory!");
    });
});

// Using async await
test("Must NOT insert a user without a email", async () => {
  const result = await request(app)
    .post("/users")
    .send({ name: "Walter Mitty", passwd: "123456" })
    .set("authorization", `bearer ${user.token}`);
  expect(result.status).toBe(400);
  expect(result.body.error).toBe("The 'mail' attribute is mandatory!");
});

// Using done
test("Must NOT insert a user without a password", (done) => {
  request(app)
    .post("/users")
    .send({ name: "Walter Mitty", mail })
    .set("authorization", `bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("The 'passwd' attribute is mandatory!");
      done();
    })
    .catch((err) => done.fail(err));
});

test("Must NOT insert a user with a already existent email", () => {
  return request(app)
    .post("/users")
    .send({ name: "Walter Mitty", mail, passwd: "123456" })
    .set("authorization", `bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("The email is already in use!");
    });
});
