// community modules
const Promise = require("promise");

// imports
const Command = require("./Command.js");

class Parser extends Command {

    // getters and set methods
    get separators() { return this._separators; }
    setSeparators(separators) { this._separators = separators; return this; }

    parse(input, custom) {
        return new Promise((resolve, reject) => {
            super.parse(this._separators, input, custom)
                .then(resolve)
                .catch(reject);
        });
    }

}

// exports
module.exports = Parser;