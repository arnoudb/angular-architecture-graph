/*eslint no-unused-expressions: 0, no-unused-vars: 0, no-eval: 0*/
"use strict";

// angular-architecture-graph
module.exports = function(scripts, options) {

    var angular = require("./src/fake-angular")(options),
        // shadow the globals
        document = {},
        window = {},
        navigator = {};

    var results = scripts.map(function(content, i) {

        try {
            // this is where the magic happens
           eval(content.text);

        } catch (e) {
            return {
                id: content.id,
                error: true,
                exception: e
            };
        }

        return {
            id: content.id,
            error: false
        };
    });

    return {
        angular: angular,
        results: results
    };
};
