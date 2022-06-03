const MONGO_URI: string = process.env.MONGO_URI || ''

import mongoose, { ConnectOptions } from 'mongoose'

const connectDB = async () => {
  try {
      mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions);
      console.log('Connected to Database');
  } catch (err) {
      console.log('Failed to connect to MongoDB', err);
  }
}

export default connectDB
