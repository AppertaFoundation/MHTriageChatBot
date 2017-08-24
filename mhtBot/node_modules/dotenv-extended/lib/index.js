'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.load = exports.config = exports.parse = undefined;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function loadEnvironmentFile(path, encoding, silent) {
    try {
        var data = _fs2.default.readFileSync(path, encoding);
        return _dotenv2.default.parse(data);
    } catch (err) {
        if (!silent) {
            console.error(err.message);
        }
        return {};
    }
} /**
   * Created by Keith Morris on 2/9/16.
   */
var parse = exports.parse = _dotenv2.default.parse.bind(_dotenv2.default);
var config = exports.config = function config(options) {

    var defaultsData,
        environmentData,
        defaultOptions = {
        encoding: 'utf8',
        silent: true,
        path: '.env',
        defaults: '.env.defaults',
        schema: '.env.schema',
        errorOnMissing: false,
        errorOnExtra: false,
        assignToProcessEnv: true,
        overrideProcessEnv: false
    };

    options = _lodash2.default.assign({}, defaultOptions, options);

    defaultsData = loadEnvironmentFile(options.defaults, options.encoding, options.silent);
    environmentData = loadEnvironmentFile(options.path, options.encoding, options.silent);

    var configData = _lodash2.default.assign({}, defaultsData, environmentData);

    if (options.errorOnMissing || options.errorOnExtra) {
        var schemaKeys = _lodash2.default.keys(loadEnvironmentFile(options.schema, options.encoding, options.silent));
        var configKeys = _lodash2.default.keys(configData);

        var missingKeys = _lodash2.default.filter(schemaKeys, function (key) {
            return configKeys.indexOf(key) < 0;
        });
        var extraKeys = _lodash2.default.filter(configKeys, function (key) {
            return schemaKeys.indexOf(key) < 0;
        });
        if (options.errorOnMissing && missingKeys.length) {
            throw new Error('MISSING CONFIG VALUES: ' + missingKeys.join(', '));
        }

        if (options.errorOnExtra && extraKeys.length) {
            throw new Error('EXTRA CONFIG VALUES: ' + extraKeys.join(', '));
        }
    }

    if (options.assignToProcessEnv) {
        if (options.overrideProcessEnv) {
            _lodash2.default.assign(process.env, configData);
        } else {
            var tmp = _lodash2.default.assign({}, configData, process.env);
            _lodash2.default.assign(process.env, tmp);
        }
    }
    return configData;
};

var load = exports.load = config;

exports.default = { parse: parse, config: config, load: load };