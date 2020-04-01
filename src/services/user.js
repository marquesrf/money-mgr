module.exports = app => {
  const findAll = () => {
    return app.db("users").select();
  };

  const save = user => {
    if (!user.name) return { error: "The 'name' attribute is mandatory!" };
    if (!user.mail) return { error: "The 'mail' attribute is mandatory!" };
    if (!user.passwd) return { error: "The 'passwd' attribute is mandatory!" };
    return app.db("users").insert(user, "*");
  };

  return { findAll, save };
};