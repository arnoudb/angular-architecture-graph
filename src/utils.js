"use strict";

function parseAngularDeps(angularDeps) {
    var deps,
        definition,
        angularDepsStr,
        depsProcessed = [];

    if (angularDeps instanceof Array) {
        definition = angularDeps.pop();
        deps = angularDeps;

    } else if (angularDeps instanceof Function) {
        definition = angularDeps;

        if (definition.$inject) {
            deps = definition.$inject;

        } else {
            // We just care about the wrapper function to the dependencies
            angularDepsStr = '' + angularDeps;
            angularDepsStr = angularDepsStr.slice(0, angularDepsStr.indexOf('{'));
            deps = /\(([^)]+)/.exec(angularDepsStr);

            if (deps && deps.length && deps[1]) {
                deps = deps[1].split(/\s*,\s*/);

            } else {
                deps = [];
            }
        }
    }

    // check if provider and scoop up the nested dependencies of the service which has probably many more deps
    // that the provider has.
    var re = /\$get\s*\:\s*([^\s]*)/m;
    var matches = re.exec(angularDeps.toString());
    var deps2 = [];

    if (matches && matches.length > 0) {
        var nestedServiceName = matches[1];
        var re2Src = "\\s+" + nestedServiceName + "\\.\\$inject\\s*=\\s*\\[([^\\]]*)\\]";
        var re2 = new RegExp(re2Src, "m");
        var matches2 = re2.exec(angularDeps.toString());

        if (matches2 && matches2.length > 0) {
            deps2 = matches2[1].replace(/["']/g, '').split(/\s*,\s*/);
        }
    }

    if (deps && deps.length) {
        deps.forEach(function(dep) {
            dep = dep.trim();
            depsProcessed.push(dep);
        });
    }

    if (deps2 && deps2.length) {
        deps2.forEach(function(dep) {
            dep = dep.trim();
            depsProcessed.push(dep);
        });
    }

    return {
        deps: depsProcessed,
        definition: definition
    };
}

module.exports = {
    parseAngularDeps: parseAngularDeps,
    noop: function() {}
};
