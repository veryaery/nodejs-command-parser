// imports
const Argument = require("./classes/Argument.js");
const Command = require("./classes/Command.js");
const Fault = require("./classes/Fault.js");
const Option = require("./classes/Option.js");
const Parser = require("./classes/Parser.js");
const Type = require("./classes/Type.js");

const methods = require("./methods.js");

const types = {
    Either: require("./types/Either.js"),
    List: require("./types/List.js"),
    Num: require("./types/Num.js"),
    Raw: require("./types/Raw.js"),
    Str: require("./types/Str.js")
};

// exports
exports.Argument = Argument;
exports.Command = Command;
exports.Fault = Fault;
exports.Option = Option;
exports.Parser = Parser;
exports.Type = Type;
exports.methods = methods;
exports.types = types;