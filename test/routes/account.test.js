const request = require("supertest");
const app = require("../../src/app");

const MAIN_ROUTE = "/accounts";
let user;

beforeAll(async () => {
  const res = await app.services.user.save({
    name: "Walter Mitty",
    mail: `${Date.now()}@mail.com`,
    passwd: "123456",
  });
  user = { ...res[0] };
});

test("Must insert an account", () => {
  return request(app)
    .post(MAIN_ROUTE)
    .send({ name: "Acc #1", user_id: user.id })
    .then((result) => {
      expect(result.status).toBe(201);
      expect(result.body.name).toBe("Acc #1");
    });
});

test("Must NOT insert a account without a name", () => {
  return request(app)
    .post(MAIN_ROUTE)
    .send({ user_id: user.id })
    .then((result) => {
      expect(result.status).toBe(400);
      expect(result.body.error).toBe("Name is a mandatory parameter!");
    });
});

test.skip("Must NOT insert an account with a name already in use", () => {});

test("Must list all accounts", () => {
  return app
    .db("accounts")
    .insert({ name: "Acc #1", user_id: user.id })
    .then(() => request(app).get(MAIN_ROUTE))
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(1);
    });
});

// this scenario will remove the previous one
test.skip("Must list only user owned accounts", () => {});

test("Must list an account given a id", () => {
  return app
    .db("accounts")
    .insert({ name: "Acc by id", user_id: user.id }, ["id"])
    .then((acc) => request(app).get(`${MAIN_ROUTE}/${acc[0].id}`))
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.name).toBe("Acc by id");
      expect(res.body.user_id).toBe(user.id);
    });
});

test.skip("Must NOT list an account given a id that is not owned by the user", () => {});

test("Must update an account given a id", () => {
  return app
    .db("accounts")
    .insert({ name: "Acc to update", user_id: user.id }, ["id"])
    .then((acc) =>
      request(app)
        .put(`${MAIN_ROUTE}/${acc[0].id}`)
        .send({ name: "Acc updated" })
    )
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.name).toBe("Acc updated");
    });
});

test.skip("Must NOT update an account given a id that is not owned by the user", () => {});

test("Must delete an account given a id", () => {
  return app
    .db("accounts")
    .insert({ name: "Acc to remove", user_id: user.id }, ["id"])
    .then((acc) => request(app).delete(`${MAIN_ROUTE}/${acc[0].id}`))
    .then((res) => {
      expect(res.status).toBe(204);
    });
});

test.skip("Must NOT delete an account given a id that is not owned by the user", () => {});
