module.exports = {
  mongoURI:
    process.env.MONGO_URI || "mongodb://127.0.0.1:27017/hostel_management_test",
  secretOrKey: process.env.SECRET_OR_KEY || "test_secret_key"
};