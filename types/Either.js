// community modules
const Promise = require("promise");

// imports
const Type = require("../classes/Type.js");
const Argument = require("../classes/Argument.js");
const Fault = require("../classes/Fault.js");
const methods = require("../methods.js");

class Either extends Type {

    constructor(types, options) {
        super(options);

        this._types = types;
    }

    _typeString() {
        return this._types.map(type => typeof type == "string" ? `"${type}"` : type.toString()).join(", ");
    }

    async parse(separators, input, custom) {
        return new Promise(async (resolve, reject) => {
            const stringTypes = [];
            const types = [];

            // catagorize types
            for (const type of this._types) {
                if (type instanceof String) {
                    stringTypes.push(type);
                } else {
                    types.push(type);
                }
            }

            const result = methods.arrayScan(input, stringTypes);

            if (result) {
                // input started with one of the strings
                return resolve({
                    input: input.slice(result.length, input.length),
                    output: result
                });
            } else {
                // input didn't start with one of the string. try each type
                for (const type of types) {
                    try {
                        const result = await new Argument().setType(type).parse(separators, input);

                        if (!result.error) {
                            return resolve(result);
                        }
                    } catch (error) {}
                }
            }

            resolve({
                error: new Fault("NEIHER", `input was neither of ${this._typeString()}`, {
                    input: input,
                    types: this._types
                })
            });
        });
    }

    toString() {
        return `either<${this._typeString()}>`;
    }

}

// exports
module.exports = Either;