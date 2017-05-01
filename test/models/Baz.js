/**
 * Baz.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports.Baz = {

    autoPK: true,

  attributes: {

      name: {

          type: 'string',

          required: true,


          minLength: 3

      },

      createdAt: {

          type: 'datetime',

          required: true,

          defaultsTo: function() {

              return new Date();
          }
      },

      createdBy: {

          model: 'foo',

          required: true
      },

      updatedAt: {

          type: 'datetime'

      },

      updatedBy: {

          model: 'foo'
      },

      deletedAt: {

          type: 'datetime',

          required: false

      },

      deletedBy: {

          model: 'foo',

          required: false
      }
  },
};
