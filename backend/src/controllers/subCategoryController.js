import { SubCategory } from '../models/subCategorySchema.js'
import { Category } from '../models/categorySchema.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { ApiError } from '../utils/ApiError.js'
import mongoose from 'mongoose'

// @desc create a subcategory
// route POST /api/v1/subcategory/create
const subCategoryCreate = async (req, res) => {
  try {
    const { name, slug, description, category } = req.body
    if (!(name && category)) {
      return res
        .status(400)
        .json(new ApiError(400, 'Name and Category are required'))
    }

    // Validate if the category ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json(new ApiError(400, 'Invalid category ID'))
    }

    // Check if the category exists
    const existingCategory = await Category.findById(category)
    if (!existingCategory) {
      return res.status(404).json(new ApiError(404, 'Category not found'))
    }

    // Generate slug if not provided
    let newSlug
    if (!slug) {
      newSlug = name.replaceAll(' ', '-').toLowerCase()
    } else {
      newSlug = slug.replaceAll(' ', '-').toLowerCase()
    }

    // Ensure the slug is unique in SubCategory
    let uniqueSlug = newSlug
    let count = 1
    while (await SubCategory.findOne({ slug: uniqueSlug })) {
      uniqueSlug = `${newSlug}-${count}`
      count++
    }

    // Check if the subCategory already exists
    const existingSubCategory = await SubCategory.findOne({ name })
    if (existingSubCategory) {
      return res
        .status(400)
        .json(new ApiError(400, 'SubCategory name already exists'))
    }

    // Create subcategory in the database
    const subCategory = await SubCategory.create({
      name,
      slug: uniqueSlug,
      description: description ? description : null,
      category,
    })

    // subCategory id push because the relation is 1 to many
    await Category.updateOne(
      { _id: category },
      { $push: { subCategory: subCategory._id } },
      { new: true }
    )

    return res
      .status(201)
      .json(
        new ApiResponse(201, 'SubCategory created successfully', { subCategory })
      )
  } catch (error) {
    console.error('SubCategory creating error:', error)
    return res
      .status(500)
      .json(
        new ApiError(500, 'SubCategory creating error', { error: error.message })
      )
  }
}

// @desc all subcategorise
// route Get /api/v1/subcategorise
const allSubCategorise = async (req, res) => {
  try {
    const subCategories = await SubCategory.find().populate('category')
    return res.json(
      new ApiResponse(200, 'Find all Subcategories', { subCategories })
    )
  } catch (error) {
    console.error('Subcategories fetching error:', error)
    return res.status(500).json(
      new ApiError(500, 'Subcategories fetching error', {
        error: error.message,
      })
    )
  }
}

export { subCategoryCreate, allSubCategorise }
