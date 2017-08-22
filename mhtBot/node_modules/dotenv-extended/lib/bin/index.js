#!/usr/bin/env node
'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
/**
 * Created by Keith Morris on 4/26/17.
 *
 * This bin script is inspired by and borrows heavily from CrossEnv
 * https://github.com/kentcdodds/cross-env
 */

var _ = require('..');

var _parseCommand3 = require('./parse-command');

var _crossSpawn = require('cross-spawn');

function loadAndExecute(args) {
    var _parseCommand = (0, _parseCommand3.parseCommand)(args),
        _parseCommand2 = _slicedToArray(_parseCommand, 3),
        dotEnvConfig = _parseCommand2[0],
        command = _parseCommand2[1],
        commandArgs = _parseCommand2[2];

    if (command) {
        var proc = (0, _crossSpawn.spawn)(command, commandArgs, {
            stdio: 'inherit',
            shell: true,
            env: (0, _.config)(dotEnvConfig)
        });

        process.on('SIGTERM', function () {
            return proc.kill('SIGTERM');
        });
        process.on('SIGINT', function () {
            return proc.kill('SIGINT');
        });
        process.on('SIGBREAK', function () {
            return proc.kill('SIGBREAK');
        });
        process.on('SIGHUP', function () {
            return proc.kill('SIGHUP');
        });
        proc.on('exit', process.exit);

        return proc;
    }
}

loadAndExecute(process.argv.slice(2));