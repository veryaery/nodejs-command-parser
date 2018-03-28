// community modules
const Promise = require("promise");

// imports
const Command = require("./Command.js");

class Parser extends Command {

    get sepperator() {
        return " ";
    }

    parse(input) {
        return new Promise((resolve, reject) => {
            super.parse(this.sepperator, input)
                .then(resolve)
                .catch(reject);
        });
    }

}

// exports
module.exports = Parser;