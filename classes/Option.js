// community modules
const Promise = require("promise");

// imports
const methods = require("../methods.js");

class Option {

    parse(sepperator, input, parent) {
        return new Promise((resolve, reject) => {
            let args = {};

            if (this.args && this.args.length > 0) {
                let argIndex = 0;

                while (input.length > 0) {
                    
                }
            }

            resolve(args);
        });
    }

}

// exports
module.exports = Option;