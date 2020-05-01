// when new db is created add some collections

const Options = require('./model/options');
const options = new Options({
    logo: 'logo.png',
    startMessage: {
        heading: 'start heading',
        message: 'start message'
    },
    endMessage: {
        heading: 'end heading',
        message: 'end message'
    }
});

options.save();