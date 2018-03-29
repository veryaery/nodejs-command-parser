// community modules
const Promise = require("promise");

// imports
const methods = require("../methods.js");
const Fault = require("./Fault.js");

class Option {

    constructor(name) {
        this._name = name;
    }

    // getters, setters, and set methods
    get name() { return this._name; }
    setName(name) { this._name = name; return this; }

    get args() { return this._args; }
    setArgs(args) { this._args = args; return this; }

    set(key, value) {
        this[key] = value;
        return this;
    }

    async parse(sepperator, input, parent, custom) {
        return new Promise(async (resolve, reject) => {
            let merged = null;
            let args = {};

            if (parent.options && parent.options.length > 0) {
                merged = methods.merge(parent.options);
            }

            if (this._args && this._args.length > 0) {
                let argIndex = 0;

                while (input.length > 0) {
                    if (merged) {
                        if (methods.scan(input, merged)) {
                            break;
                        }
                    }

                    const arg = this._args[argIndex];

                    try {
                        const result = await arg.parse(sepperator, input, custom);

                        input = result.input;
                        args[arg.name] = result.args;
                    } catch (error) {
                        return reject(error);
                    }

                    if (argIndex == this._args.length) {
                        break;
                    } else {
                        argIndex++;
                    }

                    if (methods.excess(sepperator, input)) {
                        return reject(new Fault("EXCESS", "excess input remained", { input: input }));
                    } else {
                        input = input.slice(sepperator.length, input.length);
                    }
                }

                if (argIndex < this._args.length) {
                    const arg = this._args[argIndex];

                    if (!arg.optional) {
                        return reject(new Fault("REQUIRED", `argument ${arg.name} is required`, { arg: arg }));
                    }
                }
            }

            if (methods.excess(sepperator, input)) {
                return reject(new Fault("EXCESS", "excess input remained", { input: input }));
            } else {
                input = input.slice(sepperator.length, input.length);
            }

            resolve({
                input: input,
                args: args
            });
        });
    }

}

// exports
module.exports = Option;