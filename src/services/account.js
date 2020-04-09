const ValidationError = require("../errors/ValidationError");

module.exports = (app) => {
  const findAll = (userId) => {
    return app.db("accounts").where({ user_id: userId });
  };

  const findOne = (filter = {}) => {
    return app.db("accounts").where(filter).first();
  };

  const save = async (account) => {
    if (!account.name)
      throw new ValidationError("Name is a mandatory parameter!");

    const accDb = await findOne({
      name: account.name,
      user_id: account.user_id,
    });
    if (accDb) throw new ValidationError("This user is already in use!");

    return app.db("accounts").insert(account, "*");
  };

  const update = (id, account) => {
    return app.db("accounts").where({ id }).update(account, "*");
  };

  const remove = (id) => {
    return app.db("accounts").where({ id }).del();
  };

  return { save, findAll, findOne, update, remove };
};
