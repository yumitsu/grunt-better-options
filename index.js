/*
Let's send grunt.option() to hell 
since it's broken as fuck
 */

var minimist  = require('minimist');
var _         = require('underscore');

var stubOpts = function() {
    return {
        stopEarly: false,
        boolean: [],
        string: [],
        alias: {},
        'default': {}
    };
};

var gruntOpts = function(obj) {
    var gruntArgs = require('grunt/lib/grunt/cli');
    obj = obj || stubOpts();

    _.each(gruntArgs.optlist, function(v, k) {
        if (_.isFunction(v.type) && _.isBoolean(v.type())) {
            obj.boolean.push(k);
        }
        if (v.short != void(0)) {
            obj.alias[v.short] = k;
        }
        if (v.negate != void(0) && !!v.negate) {
            obj.default[k] = false;
        }
    });

    return obj;
};

module.exports = function(grunt, opts) {
    if (_.isUndefined(opts) || _.isEmpty(opts)) {
        opts = gruntOpts();
    } else {
        if (_.isObject(opts)) {
            opts = gruntOpts(opts);
        } else {
            opts = gruntOpts();
        }
    }

    var argv = minimist(process.argv.slice(2), opts);
    if (grunt && _.isFunction(grunt.option.init)) {
        grunt.option.init(_.omit(argv, '_'));
    }

    return grunt;
};
