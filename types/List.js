// community modules
const Promise = require("promise");

// imports
const Type = require("../classes/Type.js");
const Argument = require("../classes/Argument.js");
const methods = require("../methods.js");

class List extends Type {

    constructor(type, options) {
        // defaults
        if (options) {
            for (const key in List.defaults) {
                if (!options[key]) {
                    options[key] = List.defaults[key];
                }
            }
        } else {
            options = List.defaults;
        }

        super(options);

        this._type = type;
    }

    async parse(separators, input, custom) {
        return new Promise(async (resolve, reject) => {
            const output = [];
            let list = false;
            let buffer = "";

            try {
                const result = await new Argument().setType(this._type).parse([
                    ...this._options.listSeparators,
                    ...separators
                ], input, custom);

                input = result.input;
                output.push(result.args);

                while (input.length > 0) {
                    const result = methods.arrayScan(input.slice(buffer.length, input.length), [
                        ...this._options.listSeparators,
                        ...separators
                    ], this._options.caseSensitive);

                    if (result) {
                        if (this._options.listSeparators.includes(result)) {
                            list = true;
                        }

                        buffer += result;
                    } else if (list) {
                        input = input.slice(buffer.length, input.length);
                        list = false;
                        buffer = "";

                        try {
                            const result = await new Argument().setType(this._type).parse([
                                ...this._options.listSeparators,
                                ...separators
                            ], input, custom);

                            input = result.input;
                            output.push(result.args);

                            console.log(output);
                        } catch (error) {
                            reject(error);
                        }
                    } else {
                        console.log("BREAK");
                        break;
                    }
                }
            } catch (error) {
                reject(error);
            }

            resolve([ input, output ]);
        });
    }

    toString() {
        return `list<${this._type.toString()}>`;
    }

}

// defaults
List.defaults = {
    listSeparators: [ ",", "|" ]
};

// exports
module.exports = List;