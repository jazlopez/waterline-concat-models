/**
 * Bar.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 * A case may only belong to a single user
 * A case may have many Receipts
 */

module.exports.Bar = {

    autoPK: true,

    exec: 3,

    attributes: {

        name: {

            type: 'string',

            required: true,

            minLength: 3

        },

        baz: {

            model: 'baz',

            required: true
        },

        createdAt: {

            type: 'datetime',

            required: true,

            defaultsTo: function () {

                return new Date();
            }
        },

        createdBy: {

            model: 'foo',

            required: true
        },

        updatedAt: {

            type: 'datetime',

            required: false

        },

        updatedBy: {

            model: 'foo',

            required: false
        },

        deletedAt: {

            type: 'datetime',

            required: false

        },

        deletedBy: {

            model: 'foo',

            required: false
        },
    }
};
