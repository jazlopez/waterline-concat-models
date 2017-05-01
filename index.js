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

    resolve: (file, deps, self) => {

        let def, dep, attr,

            cb, ev, tmp,

            modelAttrs, currentDir;

        currentDir = path.parse(file).dir;

        tmp = new Buffer(fs.readFileSync(file)).toString();

        ev = eval(tmp);

        if(ev.hasOwnProperty('attributes')){

            modelAttrs = Array.from(Object.keys(ev.attributes));

            for(attr in modelAttrs){

                if(modelAttrs.hasOwnProperty(attr)){

                    def = ev.attributes[modelAttrs[attr]];

                    dep = def.model || '';

                    if (!_.isEmpty(dep)) {

                        cb = path.join(currentDir, _.upperFirst(dep) + '.js');

                        if(deps.includes(cb)) {

                            continue;
                        }

                        self(cb, deps, self);
                    }
                }
            }

            if(!deps.includes(file)){

                deps.push(file);
            }
        }

        return deps;
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

        const resolve = this.resolve;

        let i, deps = [];

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


                files = files.filter(file => {

                    return (file.indexOf(".") !== 0) && (file !== "index.js");

                }).map(file => {

                    return  path.join(source, file);

                });


                for(i = 0; i < files.length; i++){

                    deps = resolve(files[i], deps, resolve);
                }

                /**
                 * Concat modules for waterline collection auto loading
                 */
                concat(deps, autoloader, (err) => {

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
