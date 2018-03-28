// community modules
const Promise = require("promise");

// imports
const methods = require("../methods.js");
const Option = require("./Options.js");

class Command extends Option {

    parse(sepperator, input) {
        return new Promise((resolve, reject) => {

        });
    }

}

// exports
module.exports = Command;