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

            for (const type of this._types) {
                if (typeof type == "string") {
                    stringTypes.push(type);
                } else {
                    types.push(type);
                }
            }

            const result = methods.arrayScan(input, stringTypes);

            if (result) {
                return resolve([ input.slice(result.length, input.length), result ]);
            } else {
                for (const type of types) {
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