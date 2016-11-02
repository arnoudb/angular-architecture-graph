"use strict";

var _ = require("lodash");

var pluralize = require("pluralize");
var utils = require("./utils");
var angularApi = require("./angular-api");

function Module(name, dependencies, options) {
    console.log("Module", name, dependencies, options);

    this.name = name;
    this.items = []; // ??

    this.controllers = [];
    this.services = [];
    this.factories = [];
    this.filters = [];
    this.providers = [];
    this.directives = [];
    this.components = [];

    this.options = options;

    // filter out angular dependencies
    if (this.options.hideAngularServices) {
        dependencies = _.filter(dependencies, function(dependency) {
            return !_.contains(angularApi.angularServices, dependency);
        });
    }

    this.modules = dependencies;
}

// Adds module methods, but is redundant ???
// angularApi.methods.forEach(function(method) {
//     Module.prototype[method] = function addItem(name) {
//         if (!name) {
//             return this;
//         }
//         this.items.push(name);
//         return this;
//     };
// });


[
    "controller",
    "factory",
    "service",
    "filter",
    "provider",
    "directive",
    "component"
].forEach(function(method) {
    Module.prototype[method] = function(name, deps) {
        if (!name) {
            return this;
        }

        if (method === "component" && deps.controller && typeof deps.controller === "function") {
            deps = deps.controller;
        }

        deps = utils.parseAngularDeps(deps).deps;

        // Exclude angular services from dependencies
        if (this.options.hideAngularServices) {
            deps = _.filter(deps, function(dep) {
                return !_.contains(angularApi.angularServices, dep);
            });
        }

        this[pluralize(method)].push({
            "name": name,
            "deps": deps
        });

        this.items.push(name);

        return this;
    };
});

Module.prototype.run = function() {
    return this;
};

Module.prototype.config = function() {
    return this;
};

// new
Module.prototype.value = function() {
    return this;
};

// new
Module.prototype.constant = function() {
    return this;
};

module.exports = Module;
