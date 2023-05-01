const mongoose = require("mongoose")

// uri = "mongodb+srv://AppStore:3Yb1I2v4Y9qtialy@appstoreapi.zjzwawq.mongodb.net/AppStoreApi?retryWrites=true&w=majority"

const connectDB = (uri) => {
  mongoose.set("strictQuery", true)
  return mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
}

module.exports = connectDB
