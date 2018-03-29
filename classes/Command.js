// community modules
const Promise = require("promise");

// imports
const methods = require("../methods.js");
const Option = require("./Option.js");
const Fault = require("./Fault.js");

class Command extends Option {

    constructor(name) {
        super(name);
    }

    // getters, setters, and set methods
    get commands() { return this._commands; }
    setCommands(commands) { this._commands = commands; return this; }

    get options() { return this._options; }
    setOptions(options) { this._options = options; return this; }

    async parse(sepperator, input, custom) {
        return new Promise(async (resolve, reject) => {
            if (this._commands && Object.keys(this._commands).length > 0) {
                const command = methods.scan(input, methods.merge(this._commands));

                if (command) {
                    input = input.slice(command.key.length, input.length);

                    if (methods.excess(sepperator, input)) {
                        return reject(new Fault("EXCESS", "excess input remained", { input: input }));
                    } else {
                        input = input.slice(sepperator.length, input.length);
                    }

                    return command.value.parse(sepperator, input, custom)
                        .then(resolve)
                        .catch(reject);
                }
            }

            let merged = null;
            let output = Object.assign({}, this);

            if (this._options && Object.keys(this._options).length > 0) {
                merged = methods.merge(this._options);
            }

            output.arguments = {};
            output.options = {};

            do {
                if (merged) {
                    const option = methods.scan(input, merged);
                    if (option) {
                        try {
                            input = input.slice(option.key.length, input.length);

                            if (methods.excess(sepperator, input)) {
                                return reject(new Fault("EXCESS", "excess input remained", { input: input }));
                            } else {
                                input = input.slice(sepperator.length, input.length);
                            }

                            const result = await option.value.parse(sepperator, input, this, custom);

                            input = result.input;
                            output.options[option.value.name] = result.args;

                            continue;
                        } catch (error) {
                            return reject(error);
                        }
                    }
                }

                try {
                    const result = await super.parse(sepperator, input, this, custom);

                    input = result.input;
                    output.arguments = result.args;
                } catch (error) {
                    return reject(error);
                }
            } while (input.length > 0)

            resolve(output);
        });
    }

}

// exports
module.exports = Command;