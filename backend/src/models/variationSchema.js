import mongoose, { Schema } from 'mongoose'

const variationSchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
)

export const Variation = mongoose.model('Variation', variationSchema)
