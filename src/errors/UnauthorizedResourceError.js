module.exports = function UnauthorizedResourceError(
  message = "This resource does not belong to the user!"
) {
  this.name = "UnauthorizedResourceError";
  this.message = message;
};
