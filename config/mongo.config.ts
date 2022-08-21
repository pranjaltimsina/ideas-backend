import mongoose, { ConnectOptions } from 'mongoose'

const connectDB = async (MONGO_URI: string) => {
  try {
    mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    } as ConnectOptions)
    if (process.env.NODE_ENV === 'development') {
      console.log('Connected to Database')
    }
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Failed to connect to MongoDB', err)
    }
  }
}

export default connectDB
