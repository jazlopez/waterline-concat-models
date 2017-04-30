'use strict';
const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const concat = require('concat-files');

/**
 *
 * WaterlineConcatModels
 *
 * @returns {{all: all}}
 *
 * @author: Jaziel Lopez <juan.jaziel@gmail.com>
 *
 * @link
    */
module.exports = {

    defaults: {

        name: 'schema.js',
    },

    /**
     * Create a suited autoloader for Waterline collection loader
     * @param source
     * @param destination
     * @param cb
     * @param autoloader
     * @returns {*}
     */
    all: function (source, destination, cb, autoloader) {

        let

            all = [],

            fullPath = '',

            loadQueue = [];

        try {

            if(!fs.existsSync(source)){

                throw new Error('No such file or directory: ' + source);
            }

            if(!fs.existsSync(destination)) {

                fs.mkdirSync(destination, '0775');
            }

            if(!autoloader){

                autoloader = path.join(destination, this.defaults.name);
            }

            if(fs.existsSync(autoloader)){

                fs.unlinkSync(autoloader);
            }

            fs.readdir(source, (err, files) => {

                if (err) {

                    throw err;
                }

                if(files.length === 0) {

                    throw new Error('Could not found any models at: ' + source);
                }


                files.filter(function (file) {

                    return (file.indexOf(".") !== 0) && (file !== "index.js");

                }).forEach(function (file) {

                    fullPath = path.join(source, file);

                    all.push({base: path.basename(fullPath), exec: require(fullPath).exec});
                });

                /**
                 *
                 * Sort queue of modules  upon exec property. If exec is undefined the element will be at end of stack
                 */
                all.sort((ancestor, successor) => {

                    if (!successor.exec) {

                        return 1;
                    }

                    return parseInt(successor.exec) - parseInt(ancestor.exec);

                });

                /**
                 * Final stack (sorted and clean)
                 */
                all.forEach(module => {

                    loadQueue.push(path.join(source, module.base));
                });


                /**
                 * Concat modules for waterline collection auto loading
                 */
                concat(loadQueue, autoloader, (err) => {

                    if (err) {

                        throw err;
                    }

                    return cb(null, autoloader);
                });

            });

        } catch (e) {

            return cb(e, null);

        }
    }
};
