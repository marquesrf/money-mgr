const ValidationError = require("../errors/ValidationError");

module.exports = (app) => {
  const findAll = (filter = {}) => {
    return app.db("users").where(filter).select();
  };

  const save = async (user) => {
    if (!user.name)
      throw new ValidationError("The 'name' attribute is mandatory!");
    if (!user.mail)
      throw new ValidationError("The 'mail' attribute is mandatory!");
    if (!user.passwd)
      throw new ValidationError("The 'passwd' attribute is mandatory!");
    const userDb = await findAll({ mail: user.mail });
    if (userDb && userDb.length > 0)
      throw new ValidationError("The email is already in use!");
    return app.db("users").insert(user, "*");
  };

  return { findAll, save };
};
