import e from 'cors'
import { Category } from '../models/categorySchema.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'

// @desc create a category
// route POST /api/v1/category/create
const categoryCreate = async (req, res) => {
  try {
    const { name, slug, description } = req.body
    if (!name) {
      return res.status(400).json(new ApiError(400, 'Name is required'))
    }

    // Generate slug if not provided
    let newSlug
    if (!slug) {
      newSlug = name.replaceAll(' ', '-').toLowerCase()
    } else {
      newSlug = slug.replaceAll(' ', '-').toLowerCase()
    }

    // Ensure the slug is unique in Category
    let uniqueSlug = newSlug
    while (await Category.findOne({ slug: uniqueSlug })) {
      const randomNumber = Math.floor(1000 + Math.random() * 9000) // Generate a random 4-digit number
      uniqueSlug = `${newSlug}-${randomNumber}`
    }

    // Check if the category already exists
    const existingCategory = await Category.findOne({ name })
    if (existingCategory) {
      return res
        .status(400)
        .json(new ApiError(400, 'Category name already exists'))
    }

    // Create category in the database
    const category = await Category.create({
      name,
      slug: uniqueSlug,
      description: description ? description : null,
    })

    return res
      .status(201)
      .json(new ApiResponse(201, 'Category created successfully', { category }))
  } catch (error) {
    console.error('Category creating error:', error)
    return res
      .status(500)
      .json(
        new ApiError(500, 'Category creating error', { error: error.message })
      )
  }
}

// @desc all category
// route Get /api/v1/categorise
const allCategorise = async (_, res) => {
  try {
    let categories = await Category.find();

    const hasAnySubCategory = categories.some(
      (cat) => cat.subCategory?.length > 0
    );

    if (hasAnySubCategory) {
      categories = await Category.find().populate('subCategory');
    }
    return res.json(new ApiResponse(200, 'Find all categories', { categories }))
  } catch (error) {
    console.error('Categories fetching error:', error)
    return res
      .status(500)
      .json(
        new ApiError(500, 'Categories fetching error', { error: error.message })
      )
  }
}

export { categoryCreate, allCategorise }

// nicher taw hobe just some condition pattern change =================================================================

// import apiResponse from 'quick-response';
// import { Category } from '../models/categorySchema.js';

// @desc create a user
// route POST /api/v1/categorise/create
// const categoryCreate = async (req, res) => {
//   try {
//     const { name, description } = req.body;
//     let { slug } = req.body;

//     if (!name) {
//       return res.status(400).json(apiResponse(400, "Name is required"));
//     }

//     // Generate slug if not provided
//     if (!slug) {
//       slug = name.replace(/\s+/g, "-").toLowerCase();
//     }

// // Generate or sanitize slug
// let newSlug = slug
// ? slug.trim().replaceAll(/\s+/g, "-").toLowerCase()
// : name.trim().replaceAll(/\s+/g, "-").toLowerCase();

// Ensure the slug is unique
// let uniqueSlug = newSlug;
// let count = 1;

// while (await Category.findOne({ slug: uniqueSlug })) {
//   uniqueSlug = `${newSlug}-${count}`;
//   count++;
// }

//     // Check if the category already exists
//     const existingCategory = await Category.findOne({ name });
//     if (existingCategory) {
//       return res
//         .status(400)
//         .json(apiResponse(400, "Category name already exists"));
//     }

//     // Create category in the database
//     const category = await Category.create({ name, slug, description });

//     return res
//       .status(201)
//       .json(apiResponse(201, "Category created successfully", { category }));
//   } catch (error) {
//     console.error("Category creating error:", error);
//     return res
//       .status(500)
//       .json(apiResponse(500, "Category creating error", { error: error.message }));
//   }
// };

// export { categoryCreate };

// nicher taw hobe just some condition pattern change =================================================================

