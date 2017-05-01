/**
 * Foo.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports.Foo = {

  schema: true,

  autoPK: true,

  attributes: {
      email: {
          type: 'email',
          required: 'true',
          unique: true // Yes unique one
      },
      fname: {
          type: 'string',
          required: true
      },
      lname: {
          type: 'string',
          required: true
      }
  }
};
