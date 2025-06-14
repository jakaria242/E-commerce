import mongoose, { Schema } from 'mongoose'

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: 'Category',
      required: true,
    },

    subCategory: {
      type: mongoose.Types.ObjectId,
      ref: 'SubCategory',
      required: true,
    },
    thumbnail: {
      publicId: {
        type: String,
        required: true,
      },
      imagePath: {
        type: String,
        required: true,
      },
    },
    gallery: [
      {
        publicId: {
          type: String,
        },
        imagePath: {
          type: String,
        },
      },
    ],
    inventory: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Inventory',
      },
    ],
  },
  { timestamps: true }
)

export const Product = mongoose.model('Product', productSchema)
