// community modules
const Promise = require("promise");

// imports
const Command = require("./Command.js");

class Parser extends Command {

    // getters and set methods
    get sepperator() { return this._sepperator; }
    setSepperator(sepperator) { this._sepperator = sepperator; return this; }

    parse(input) {
        return new Promise((resolve, reject) => {
            super.parse(this._sepperator, input)
                .then(resolve)
                .catch(reject);
        });
    }

}

// exports
module.exports = Parser;