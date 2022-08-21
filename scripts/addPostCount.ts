import { User } from '../models/user'
import Idea from '../models/idea'
import Comment from '../models/comment'

const addPostCount = async () => {
  const users = await User.find().lean()

  users.forEach(async (user) => {
    try {
      const ideaCount = await Idea.countDocuments({ author: user._id })
      const commentCount = await Comment.countDocuments({ author: user._id })
      await User.findByIdAndUpdate(user._id, { ideaCount, commentCount })
    } catch (e) {
      console.error(e)
    }
  })
}

export default addPostCount
