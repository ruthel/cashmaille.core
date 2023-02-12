const mongoose = require("mongoose");
const connectionUrl = process.env.MONGODBURL || 'mongodb://localhost:27017/cashmaille?readPreference=primary&appname=MongoDB%20Compass&ssl=false'
// const connectionUrl = process.env.MONGODBURL || 'mongodb+srv://smartlease:131516212128-6-Mai@cluster0.0kbzz.mongodb.net/cashmaille?retryWrites=true&w=majority'

mongoose.connect(connectionUrl, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

module.exports = mongoose.connection;
