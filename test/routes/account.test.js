const request = require("supertest");
const jwt = require("jwt-simple");

const app = require("../../src/app");

const MAIN_ROUTE = "/v1//accounts";
let user;
let user2;

beforeEach(async () => {
  const res = await app.services.user.save({
    name: "User account",
    mail: `${Date.now()}@mail.com`,
    passwd: "123456",
  });
  user = { ...res[0] };
  user.token = jwt.encode(user, "s3cr3t");
  const res2 = await app.services.user.save({
    name: "User account #2",
    mail: `${Date.now()}@mail.com`,
    passwd: "123456",
  });
  user2 = { ...res2[0] };
});

test("Must insert an account", () => {
  return request(app)
    .post(MAIN_ROUTE)
    .send({ name: "Acc #1" })
    .set("authorization", `bearer ${user.token}`)
    .then((result) => {
      expect(result.status).toBe(201);
      expect(result.body.name).toBe("Acc #1");
    });
});

test("Must NOT insert a account without a name", () => {
  return request(app)
    .post(MAIN_ROUTE)
    .send({})
    .set("authorization", `bearer ${user.token}`)
    .then((result) => {
      expect(result.status).toBe(400);
      expect(result.body.error).toBe("Name is a mandatory parameter!");
    });
});

test("Must NOT insert an account with a name already in use", () => {
  return app
    .db("accounts")
    .insert({ name: "Acc already in use", user_id: user.id })
    .then(() =>
      request(app)
        .post(MAIN_ROUTE)
        .set("authorization", `bearer ${user.token}`)
        .send({ name: "Acc already in use" })
    )
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("This user is already in use!");
    });
});

test("Must list only user owned accounts", () => {
  return app
    .db("accounts")
    .insert([
      { name: "Acc User #1", user_id: user.id },
      { name: "Acc User #2", user_id: user2.id },
    ])
    .then(() =>
      request(app).get(MAIN_ROUTE).set("authorization", `bearer ${user.token}`)
    )
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].name).toBe("Acc User #1");
    });
});

test("Must list an account given a id", () => {
  return app
    .db("accounts")
    .insert({ name: "Acc by id", user_id: user.id }, ["id"])
    .then((acc) =>
      request(app)
        .get(`${MAIN_ROUTE}/${acc[0].id}`)
        .set("authorization", `bearer ${user.token}`)
    )
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.name).toBe("Acc by id");
      expect(res.body.user_id).toBe(user.id);
    });
});

test("Must NOT list an account given a id that is not owned by the user", () => {
  return app
    .db("accounts")
    .insert({ name: "Acc User #2", user_id: user2.id }, ["id"])
    .then((acc) =>
      request(app)
        .get(`${MAIN_ROUTE}/${acc[0].id}`)
        .set("authorization", `bearer ${user.token}`)
    )
    .then((res) => {
      expect(res.status).toBe(403);
      expect(res.body.error).toBe("This resource does not belong to the user!");
    });
});

test("Must update an account given a id", () => {
  return app
    .db("accounts")
    .insert({ name: "Acc to update", user_id: user.id }, ["id"])
    .then((acc) =>
      request(app)
        .put(`${MAIN_ROUTE}/${acc[0].id}`)
        .send({ name: "Acc updated" })
        .set("authorization", `bearer ${user.token}`)
    )
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.name).toBe("Acc updated");
    });
});

test("Must NOT update an account given a id that is not owned by the user", () => {
  return app
    .db("accounts")
    .insert({ name: "Acc User #2", user_id: user2.id }, ["id"])
    .then((acc) =>
      request(app)
        .put(`${MAIN_ROUTE}/${acc[0].id}`)
        .send({ name: "Acc updated" })
        .set("authorization", `bearer ${user.token}`)
    )
    .then((res) => {
      expect(res.status).toBe(403);
      expect(res.body.error).toBe("This resource does not belong to the user!");
    });
});

test("Must delete an account given a id", () => {
  return app
    .db("accounts")
    .insert({ name: "Acc to remove", user_id: user.id }, ["id"])
    .then((acc) =>
      request(app)
        .delete(`${MAIN_ROUTE}/${acc[0].id}`)
        .set("authorization", `bearer ${user.token}`)
    )
    .then((res) => {
      expect(res.status).toBe(204);
    });
});

test("Must NOT delete an account given a id that is not owned by the user", () => {
  return app
    .db("accounts")
    .insert({ name: "Acc User #2", user_id: user2.id }, ["id"])
    .then((acc) =>
      request(app)
        .delete(`${MAIN_ROUTE}/${acc[0].id}`)
        .set("authorization", `bearer ${user.token}`)
    )
    .then((res) => {
      expect(res.status).toBe(403);
      expect(res.body.error).toBe("This resource does not belong to the user!");
    });
});
