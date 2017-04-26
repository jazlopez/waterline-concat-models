'use strict';

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

        /**
         *
         * Create a suited autoloader for Waterline collection loader
         *
         * @param cb
         * @param models
         * @param autoloader
         */
        all: function (cb, models, autoloader) {

            /**
             *
             */
            return new Promise(() => {

                let all = [], loadQueue = [];

                if (!models) {

                    models = path.join(__dirname, 'models');
                }

                if (!autoloader) {
                    autoloader = path.join(__dirname, 'autoload', 'autoload.js');
                }

                fs.readdirSync(models).filter(function (file) {

                    return (file.indexOf(".") !== 0) && (file !== "index.js");

                }).forEach(function (file) {

                    const fullPath = path.join(models, file);

                    all.push({base: path.basename(fullPath), exec: require(fullPath).exec});

                });

                /**
                 *
                 * Sort queue of modules  upon exec property. If exec is undefined the element will be at end of stack
                 */
                all.sort((antecesor, sucesor) => {

                    if (!sucesor.exec) {

                        return 1;
                    }

                    return parseInt(sucesor.exec) - parseInt(antecesor.exec);

                }).reverse();

                /**
                 * Final stack (sorted and clean)
                 */
                all.forEach(module => {

                    loadQueue.push(path.join(models, module.base))
                });


                /**
                 * Concat modules for waterline collection auto loading
                 */
                concat(loadQueue, autoloader, (err) => {

                    if (err) {

                        return cb(new Error(err.message, null));
                    }

                    return cb(null, autoloader);
                });
            })
        }
};
