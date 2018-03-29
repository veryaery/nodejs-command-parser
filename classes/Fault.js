class Fault extends Error {

    constructor(type, message, details) {
        super(message);

        this.type = type;
        this.details = details;
    }

}

// exports
module.exports = Fault;