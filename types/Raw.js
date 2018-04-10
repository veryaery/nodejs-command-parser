// imports
const Type = require("../classes/Type.js");

class Raw extends Type {

    parse(separators, input, custom) {
        return {
            input: "",
            output: input
        };
    }

    toString() {
        return "raw";
    }

}

// exports
module.exports = Raw;