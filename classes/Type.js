class Type {

    constructor(options) {
        this._options = options;
    }

    // getters, setters, and set methods
    get options() { return this._options; }
    set options(options) { this._options = options; }
    setOptions(options) { this._options = options; return this; }

    set(key, value) {
        this[key] = value;
        return this;
    }

    parse(separators, input, custom) {
        return {
            input: input,
            output: null
        };
    }

    toString() {
        return null;
    }

}

// exports
module.exports = Type;