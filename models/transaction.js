const { Schema, model } = require('mongoose');
const Joi = require('joi');
const { handleSaveErrors } = require('../helpers');
const dateRegexp = /^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[012])\.(19|20)\d\d$/;

const transactionSchema = new Schema(
  {
    date: {
      type: String,
      required: true,
      match: dateRegexp,
    },
    isIncome: {
      type: Boolean,
      required: [true, 'Type is required'],
    },
    comment: {
      type: String,
    },
    sum: {
      type: String,
      required: [true, 'Sum is required'],
    },
    category: {
      type: String,
      enum: [
        'Expense',
        'Income',
        'Main expenses',
        'Products',
        'Car',
        'Self care',
        'Child care',
        'Household products',
        'Education',
        'Leisure',
        'Other expenses',
        'Entertainment',
      ],
      default: 'Expense',
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
  },
  { versionKey: false, timestamps: true }
);

transactionSchema.post('save', handleSaveErrors);

const Transaction = model('transaction', transactionSchema);

const addTransactionSchema = Joi.object({
  date: Joi.string()
    .pattern(dateRegexp)
    .messages({
      'string.base': 'Should be a type of string',
      'string.empty': 'Must contain value',
      'string.pattern.base': 'Must be in format "dd.mm.yyyy" ',
      'any.required': 'Date is a required field',
    })
    .required(),

  isIncome: Joi.boolean()
    .messages({
      'boolean.base': 'isIncome should be a type of boolean',
      'any.empty': 'Must contain value',
      'any.required': 'isIncome is a required field',
    })
    .required(),

  comment: Joi.string().messages({
    'string.base': 'Should be a type of string',
    'string.empty': 'Must contain value',
  }),

  sum: Joi.string()
    .messages({
      'string.base': 'Should be a type of string',
      'string.empty': 'Must contain value',
      'any.required': 'Sum is a required field',
    })
    .required(),

  category: Joi.string()
    .valid(
      'Expense',
      'Income',
      'Main expenses',
      'Products',
      'Car',
      'Self care',
      'Child care',
      'Household products',
      'Education',
      'Leisure',
      'Other expenses',
      'Entertainment'
    )
    .messages({
      'string.base': 'Should be a type of string',
      'string.empty': 'Must contain value',
    }),
});

const schemas = { addTransactionSchema };

module.exports = {
  Transaction,
  schemas,
};
