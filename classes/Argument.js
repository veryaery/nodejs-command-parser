// community modules
const Promise = require("promise");

class Argument {

    constructor(name) {
        this._name = name;
    }

    // getters and set methods
    get name() { return this._name; }
    setName(name) { this._name = name; return this; }

    get type() { return this._type; }
    setType(type) { this._type = type; return this; }

    get optional() { return this._optional; }
    setOptional(optional) { this._optional = optional; return this; }

    parse(sepperator, input, custom) {
        return new Promise((resolve, reject) => {
            let result;

            try {
                result = this._type(sepperator, input, custom);
            } catch (error) {
                reject(error);
            }

            if (result instanceof Promise) {
                result
                    .then(result => {
                        resolve({
                            input: result[0],
                            args: result[1]
                        })
                    })
                    .catch(reject);
            } else {
                resolve({
                    input: result[0],
                    args: result[1]
                });
            }
        });
    }

}

// exports
module.exports = Argument;