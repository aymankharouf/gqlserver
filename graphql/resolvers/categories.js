const { AuthenticationError, UserInputError } = require('apollo-server')
const Category = require('../../models/category')
const authCheck = require('./auth-check')
const { validateCategoryInput } = require('./validators')

const categoryResolvers = {
  Query: {
    categories: async () => {
      try {
        const categories = await Category.find()
        return categories
      } catch (err) {
        throw new Error(err)
      }
    },
    category: async (parent, args) => {
      try{
        if (!args.id.match(/^[0-9a-fA-F]{24}$/)) {
          throw new Error('Invalid ID');
        }
        const category = await Category.findById(args.id)
        if (category) {
          return category
        } else {
          throw new Error('category not found')
        }
      } catch (err) {
        throw new Error(err)
      }
    }
  },
  Mutation: {
    createCategory: async (parent, args, context) => {
      const errors = validateCategoryInput(args.name)
      if (Object.keys(errors).length > 0) {
        throw new UserInputError('Errors', {errors})
      }
      //const user = authCheck(context)
      //if (user) {
        const newCategory = new Category({
          name: args.name,
          ordering: args.ordering,
          isLeaf: args.isLeaf
        })  
      //}
      const category = await newCategory.save()
      return category
    },
    deleteCategory: async (parent, args, context) => {
      try {
        const category = await Category.findById(args.id)
        const user = authCheck(context)
        if (user) {
          await category.delete()
          return 'Category deleted'
        } else {
          throw new AuthenticationError('Action not allowed')
        }
      } catch (err) {
        throw new Error(err)
      }
    }
  },
};

module.exports = categoryResolvers
