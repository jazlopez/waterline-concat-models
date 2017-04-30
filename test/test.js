"use strict";

const WaterLineConcat = require("./../index");

const path = require('path');

const should = require("should");

/**
 * Define where to locate your existing modules and location for autoloader
 *
 * @source      // path to models to load into Waterline ORM
 * @destination // path to directory on which the autoloader will be created.
 */

const source = path.join(__dirname, 'models');

const destination = path.join(__dirname, 'autoload');

describe("waterline-concat-models#all", function () {

    it("should prepare schema for waterline", function (done) {

        WaterLineConcat.all(source, destination, function (err, autoloader) {

            if (err) {

                return done(err);
            }

            console.log("  > Schema autoloader at: %s", autoloader);

            return done();
        });
    });
});
