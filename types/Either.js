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
        return this._types.map(type => typeof type == String ? type : type.toString()).join(", ");
    }

    async parse(separators, input, custom) {
        return new Promise(async (resolve, reject) => {
            let buffer = "";

            for (const char of input.split("")) {
                const remaining = input.slice(buffer.length, input.length);
                const result = methods.arrayScan(remaining, separators);

                if (result) {
                    break;
                } else {
                    buffer += char;
                }
            }

            for (const type of this._types) {
                if (buffer == type) {
                    return resolve([ input.slice(buffer.length, input.length), type ]);
                } else {
                    try {
                        const result = await new Argument().setType(type).parse(separators, input);

                        return resolve([ result.input, result.args ]);
                    } catch (error) {}
                }
            }

            reject(new Fault("NEIHER", `input was neither of ${this._typeString()}`, {
                input: input,
                types: this._types
            }));
        });
    }

    toString() {
        return `either<${this._typeString()}>`;
    }

}

// exports
module.exports = Either;