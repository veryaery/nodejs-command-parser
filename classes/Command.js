// community modules
const Promise = require("promise");

// imports
const methods = require("../methods.js");
const Option = require("./Options.js");

class Command extends Option {

    constructor(name) {
        super(name);
    }

    // getters and set methods
    get commands() { return this._commands; }
    commands(commands) { this._commands = commands; return this; }

    get options() { return this._options; }
    options(options) { this._options = options; return this; }

    async parse(sepperator, input) {
        return new Promise(async (resolve, reject) => {
            if (this._commands && this._commands.length > 0) {
                const command = methods.scan(input, methods.merge(this._commands));

                if (command) {
                    input = input.slice(command.key.length, input.length);

                    if (methods.excess(sepperator, input)) {
                        return reject(new Fault("EXCESS", "excess input remained", { input: input }));
                    }

                    return command.value.parse(sepperator, input)
                        .then(resolve)
                        .catch(reject);
                }
            }

            let merged = null;
            let output = this;

            if (this._options && this._options.length > 0) {
                merged = methods.merge(this._options);
            }

            output.arguments = {};
            output.options = {};

            while (input.length > 0) {
                if (merged) {
                    const option = methods.scan(input, merged);

                    if (option) {
                        try {
                            output.options[option.value.name] = await option.value.parse(sepperator, input, this);
                            continue;
                        } catch (error) {
                            return reject(error);
                        }
                    }
                }

                try {
                    output.arguments = await super.parse(sepperator, input);
                } catch (error) {
                    return reject(error);
                }
            }

            resolve(output);
        });
    }

}

// exports
module.exports = Command;