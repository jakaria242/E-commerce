import mongoose, { Schema } from 'mongoose'

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
    subCategory: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'SubCategory',
      },
    ],
  },
  { timestamps: true }
)

export const Category = mongoose.model('Category', categorySchema)