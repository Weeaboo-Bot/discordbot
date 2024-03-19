
const FirestoreDB = require('./db-utils');
const { firebase } = require('../config');

module.exports = class CasinoUtils {
    constructor(logger) {
        this.db = new FirestoreDB(firebase, logger);
        this.logger = logger;
    }
    generateTimestamp() {
        return this.db.createNowTimestamp();
    }
    convertTimestampToDiscordFormat(timestamp) {
        // Validate timestamp and throw error if invalid
        if (!this.isValidTimestamp(timestamp)) {
            throw new Error('Invalid timestamp format. Please provide a valid number representing milliseconds since epoch or a Firestore timestamp object.');
        }

        // Handle Firestore timestamp format (if applicable)
        if (typeof timestamp === 'object' && timestamp._seconds && timestamp._nanoseconds) {
            const seconds = timestamp._seconds;
            const nanoseconds = timestamp._nanoseconds;
            const milliseconds = seconds * 1000 + Math.floor(nanoseconds / 1000000);
            timestamp = milliseconds;
        }

        // Create a new Date object from the timestamp (now in milliseconds)
        const date = new Date(timestamp);

        // Function for zero-padding numbers (reusable)
        const zeroPad = (number, length = 2) => String(number).padStart(length, '0');

        // Format the timestamp components with zero-padding
        const year = zeroPad(date.getFullYear());
        const month = zeroPad(date.getMonth() + 1); // Months are zero-indexed
        const day = zeroPad(date.getDate());
        const hours = zeroPad(date.getHours());
        const minutes = zeroPad(date.getMinutes());

        // Return the formatted Discord timestamp string
        return `<t:${year}-${month}-${day}T${hours}:${minutes}:00.000Z>`;
    }

    // Helper function to validate timestamp format
    isValidTimestamp(timestamp) {
        return typeof timestamp === 'number' && !isNaN(timestamp) || (typeof timestamp === 'object' && timestamp._seconds && timestamp._nanoseconds);
    }

    async getUser(userId) {
        try {
            const userData = await this.db.getDocument('users', userId);
            if (userData) {
                this.logger.info(`User Data: ${JSON.stringify(userData)}`);
                return userData;
            } else {
                this.logger.info('User not found');
            }
        } catch (error) {
            this.logger.error(`Error getting user: ${error}`);
        }
    }

    async getUsers() {
        try {
            const users = await this.db.getDocs('users');
            const userBalances = await this.db.getDocs('user_balances');
            this.logger.info(`Users: ${JSON.stringify(users)}`);
            return users;
        } catch (error) {
            this.logger.error(`Error getting users: ${error}`);
        }
    }

    async createUser(userData, initialBalance) {
        try {
            const result = await this.db.createUser('users', userData, 'user_balances', initialBalance, userData.userId);
            this.logger.info("User created successfully!");
            return result;
        } catch (error) {
            this.logger.error("Error creating User:", error);
            // You might want to rethrow the error or handle it differently here
        }
    }

    async getUserBalance(userId) {
        try {
            const userBalanceDoc = await this.db.getDocument('user_balances', userId);
            return userBalanceDoc.data().balance;
        } catch (error) {
            this.logger.error("Error getting user balance:", error);
            return 0; // Return 0 for error handling
        }
    }

    getUserWins(userId) {
        try {
            const userWins = this.db.getRecordsById('user_wins', 'userId', userId);
            return userWins;
        } catch (error) {
            this.logger.error("Error getting user wins:", error);
            return 0; // Return 0 for error handling
        }
    }
    getUserLosses(userId) {
        try {
            const userWins = this.db.getRecordsById('user_losses', 'userId', userId);
            return userWins;
        } catch (error) {
            this.logger.error("Error getting user losses:", error);
            return 0; // Return 0 for error handling
        }
    }
    getUserWinRate(casino, user) {
    }
    async addBalance(id, amount) {
        try {
            const res = await this.db.updateValueInDoc('user_balances', id, 'balance', amount);
            this.logger.info(`Added user ${id} balance`);
            return res.balance;
        } catch (error) {
            this.logger.error("Error adding balance:", error);
        }

    }
    placeBet(casino, user, amount) {
    }
    async checkUserBalance(id) {
        try {
            const userBalance = await this.db.getDocument('user_balances', id);
            return userBalance.balance;
        } catch (error) {
            this.logger.error("Error getting user balance:", error);
        }
    }
    async checkDailyUserBalance() {
        try {
            const balRecords = await this.db.getMatchingRecords('users', 'user_balances');
            for (const balRecord of balRecords) {
                if (balRecord.balance < 1000) {
                    await this.addBalance(balRecord.id, 1000 - balRecord.balance);
                }
            }
        } catch (error) {
            this.logger.error("Error updating user balance daily:", error);
        }
    }

};
