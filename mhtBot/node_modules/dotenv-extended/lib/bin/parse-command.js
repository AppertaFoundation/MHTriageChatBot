'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.parseCommand = undefined;

var _autoParse = require('auto-parse');

var _autoParse2 = _interopRequireDefault(_autoParse);

var _camelcase = require('camelcase');

var _camelcase2 = _interopRequireDefault(_camelcase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by Keith Morris on 4/26/17.
 */
var dotEnvFlagRegex = /^--(.+)=(.+)/;

/**
 * First parses config variables for dotenv-extended then selects the next item as the command and everything after that
 * are considered arguments for the command
 *
 * @param args
 * @returns {[Object,String,Array]}
 */
var parseCommand = exports.parseCommand = function parseCommand(args) {
    var config = {};
    var command = null;
    var commandArgs = [];
    for (var i = 0; i < args.length; i++) {
        var match = dotEnvFlagRegex.exec(args[i]);
        if (match) {
            config[(0, _camelcase2.default)(match[1])] = (0, _autoParse2.default)(match[2]);
        } else {
            // No more env setters, the rest of the line must be the command and args
            command = args[i];
            commandArgs = args.slice(i + 1);
            break;
        }
    }
    return [config, command, commandArgs];
};