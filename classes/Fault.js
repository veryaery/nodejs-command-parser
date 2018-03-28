class Fault extends Error {

    constructor(type, message, details) {
        this.type = type;
        this.details = details;

        super(message);
    }

}

// exports
module.exports = Fault;