module.exports = app => {
  const findAll = (filter = {}) => {
    return app
      .db("users")
      .where(filter)
      .select();
  };

  const save = async user => {
    if (!user.name) return { error: "The 'name' attribute is mandatory!" };
    if (!user.mail) return { error: "The 'mail' attribute is mandatory!" };
    if (!user.passwd) return { error: "The 'passwd' attribute is mandatory!" };
    const userDb = await findAll({ mail: user.mail });
    if (userDb && userDb.length > 0)
      return { error: "The email is already in use!" };
    return app.db("users").insert(user, "*");
  };

  return { findAll, save };
};
