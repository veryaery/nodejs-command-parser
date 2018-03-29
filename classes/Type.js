class Type {

    constructor(options) {
        this._options = options;
    }

    // getters and set methods
    get options() { return this._options; }
    setOptions(options) { this._options = options; return this; }

    set(key, value) {
        this[key] = value;
        return this;
    }

    parse(separators, input, custom) {
        return [ input, null ];
    }

    toString() {
        return null;
    }

}

// exports
module.exports = Type;