// community modules
const Promise = require("promise");

// imports
const methods = require("../methods.js");
const Fault = require("./Fault.js");

class Option {

    constructor(name) {
        this._name = name;
    }

    // getters and set methods
    get name() { return this._name; }
    name(name) { this._name = name; return this; }

    get args() { return this._args; }
    args(args) { this._args = args; return this; }

    async parse(sepperator, input, parent) {
        return new Promise(async (resolve, reject) => {
            const merged = methods.merge(parent.options);
            let args = {};

            if (this.args && this.args.length > 0) {
                let argIndex = 0;

                while (input.length > 0) {
                    if (methods.scan(input, merged)) {
                        break;
                    }

                    const arg = this.args[argIndex];

                    try {
                        args[arg.name] = await arg.type.test(input);
                    } catch (error) {
                        return reject(error);
                    }

                    if (argIndex == this.args.length) {
                        break;
                    } else {
                        argIndex++;
                    }

                    if (methods.excess(sepperator, input)) {
                        return reject(new Fault("EXCESS", "excess input remained", { input: input }));
                    }
                }

                if (argIndex < this.args.length - 1) {
                    const arg = this.args[argIndex];

                    if (!arg.optional) {
                        return reject(new Fault("REQUIRED", `argument ${arg.name} is required`, { arg: arg }));
                    }
                }
            }

            if (methods.excess(sepperator, input)) {
                return reject(new Fault("EXCESS", "excess input remained", { input: input }));
            }

            resolve(args);
        });
    }

}

// exports
module.exports = Option;