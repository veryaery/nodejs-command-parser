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

}

// exports
module.exports = Argument;