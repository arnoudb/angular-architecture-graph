"use strict";

var _ = require("lodash");

var utils = require("./utils");
var angularApi = require("./angular-api");
var Module = require("./module");

module.exports = function(options) {

    options = _.merge({
        hideAngularServices: false
    }, options || {});

    var angular = {
        modules: [],
        modulesMap: {},
        modulesNames: [],
        options: options,

        module: function(name, dependencies) {
            var module;

            // Module was inserted before
            if (this.modulesNames.indexOf(name) !== -1) {
                module = this.modulesMap[name];

                if (dependencies) {
                    this.modulesMap[name].modules = dependencies;
                }

            // First time we see this module
            } else {
                module = new Module(name, dependencies, options);
                this.modulesNames.push(name);
                this.modulesMap[name] = module;
                this.modules.push(module);
            }

            return module;
        }
    };

    // Adds global apis to the angular object
    angularApi.globalApis.forEach(function(method) {
        angular[method] = utils.noop;
    });

    return angular;
};
