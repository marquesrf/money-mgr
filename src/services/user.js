module.exports = app => {
  const findAll = () => {
    return app.db("users").select();
  };

  const save = user => {
    if (!user.name) return { error: "The 'name' attribute is mandatory!" };
    return app.db("users").insert(user, "*");
  };

  return { findAll, save };
};
