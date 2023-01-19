const Keyv = require('keyv');
const keyv = new Keyv('sqlite:database.sqlite', {
    table: 'reactions',
    busyTimeout: 10000
});
keyv.on('error', err => console.error('Keyv connection error:', err));

module.exports = class DbHandler {

    static async setValue(key, value) {
        return await keyv.set(key, value);
    }

    static async getValue(key) {
        return await keyv.get(key);
    }

    static async clearValue(key) {
        return await keyv.delete(key);
    }

    static async clearAllValues() {
        return await keyv.clear();
    }
}