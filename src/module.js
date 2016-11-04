"use strict";

var _ = require("lodash");
var utils = require("./utils");
var angularApi = require("./angular-api");

var pluralize = {
    "controller": "controllers",
    "factory": "factories",
    "service": "services",
    "filter": "filters",
    "provider": "providers",
    "directive": "directives",
    "component": "components",
    "run": "runs",
    "config": "configs"
}

function Module(name, dependencies, options) {

    this.name = name;
    this.items = []; // ??

    this.controllers = [];
    this.services = [];
    this.factories = [];
    this.filters = [];
    this.providers = [];
    this.directives = [];
    this.components = [];
    this.configs = [];
    this.runs = [];

    this.options = options;

    // filter out angular dependencies
    if (this.options.hideAngularServices) {
        dependencies = _.filter(dependencies, function(dependency) {
            return !_.contains(angularApi.angularServices, dependency);
        });
    }

    this.modules = dependencies;
}

[
    "controller",
    "factory",
    "service",
    "filter",
    "provider",
    "directive",
    "component",
    "run",
    "config"
].forEach(function(method) {
    Module.prototype[method] = function(name, deps) {
        var that = this;

        if (!name) {
            return this;

        } else if (typeof name === "function") {
            deps = name;
            name = name.name;
        }

        if (method === "component" && deps.controller && typeof deps.controller === "function") {
            deps = deps.controller;
        }

        setTimeout(function() {
            deps = utils.parseAngularDeps(deps).deps;

            // Exclude angular services from dependencies
            if (that.options.hideAngularServices) {
                deps = _.filter(deps, function(dep) {
                    return !_.contains(angularApi.angularServices, dep);
                });
            }

            that[pluralize[method]].push({
                "name": name,
                "deps": deps
            });

            that.items.push(name);
        });

        return that;
    };
});

// Module.prototype.run = function() {
//     return this;
// };
//
// Module.prototype.config = function() {
//     return this;
// };

// new
Module.prototype.value = function() {
    return this;
};

// new
Module.prototype.constant = function() {
    return this;
};

module.exports = Module;
