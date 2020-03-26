const PT = require('./pt');
const EN = require('./en');

class Messages {
    static language = EN;

    static set(language) {

        // Portuguese Language
        if (language == "PT") {
            this.language = PT;
        }
        // Default Language is English
        else {

        }
    }

    static get(msg) {
        const msgSplitted = msg.toLowerCase().split("_");
        const message = this.language[msgSplitted[0]][msgSplitted[1]][msgSplitted[2]];

        if (!message)
            return msg;
        return message;
    }
}

module.exports = Messages;

