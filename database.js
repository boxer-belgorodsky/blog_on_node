var mongoose = require("mongoose");

module.exports = function() {
  return new Promise(function(resolve, reject) {
    mongoose.Promise = global.Promise;
    mongoose.set("debug", true);
    mongoose.connection
      .on("error", (error) => reject(error))
      .on("close", () => console.log("database close"))
      .once("open", () => resolve(mongoose.connection[0]));

    mongoose.connect("mongodb://localhost/blog", { useMongoClient: true });
  });
};
