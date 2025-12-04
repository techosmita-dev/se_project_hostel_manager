const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateStudentInput(data) {
  const errors = {};
  const genders = ['MALE', 'FEMALE']

  data.name = !isEmpty(data.name) ? data.name : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.batch = data.batch !== undefined && data.batch !== null ? data.batch : "";
  data.id = !isEmpty(data.id) ? data.id : "";
  data.block = !isEmpty(data.block) ? data.block : "";
  data.room = !isEmpty(data.room) ? data.room : "";
  data.gender = !isEmpty(data.gender) ? data.gender : "";
  if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = "Email Field is Required";
  }
  if (Validator.isEmpty(data.name)) {
    errors.name = "Name is Required";
  }
  if (data.batch === "" || data.batch === null || data.batch === undefined || (typeof data.batch === 'number' && (data.batch < 2022 || data.batch > 2025))) {
    errors.batch = "Batch is required and must be between 2022 and 2025";
  }
  if (Validator.isEmpty(data.id)) {
    errors.id = "Student Id is Required";
  }
  if (Validator.isEmpty(data.block)) {
    errors.block = "Block is Required";
  }
  if (Validator.isEmpty(data.room)) {
    errors.room = "Room is Required";
  }
  if (Validator.isEmpty(data.gender) || !genders.includes(data.gender)) {
    errors.gender = "Gender Missing or Invalid";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
