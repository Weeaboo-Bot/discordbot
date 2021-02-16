const admin = require('firebase-admin');
const logger = require('../util/logger');
const fbConfig = require('../config').fbAdminConfig;
admin.initializeApp({
	credential: admin.credential.cert(fbConfig),
	storageBucket: 'gs://weaboo-bot-73b07.appspot.com/',
});

const storage = admin.storage().bucket();
const jsonBucket = admin.storage().bucket('json-bucket');

module.exports = class WeabooStorage {

	async listFiles(collectionName) {
		let result;
		try {
			const [files] = await storage.bucket(collectionName).getFiles();
			result = files;
			result.forEach(file => {
				logger.info(`File Name: ${file.name}`);
			});
		}
		catch (error) {
			logger.error(`A Storage Error: ${error}`);
			result = { success: false, error: error.message };
		}
		logger.info(`Status: ${result.success}`);
	}

	async uploadFile(collectionName) {
		try {
			await storage.upload(collectionName, {
				destination: `./json/${collectionName}`,
				metadata: {
					cacheControl: 'public, max-age=31536000',
				},
			}).then(result => {
				logger.debug(result);
				logger.info(`Uploaded ${collectionName} to remote storage.`);
			}).catch(error => {
				logger.error(`A storage error occured: ${error}`);
			});

		}
		catch(error) {
			logger.error(`A storage error occured: ${error}`);
		}
	}

	async deleteFile(collectionName) {
		try {
			await storage.file(collectionName).delete()
				.then(result => {
					logger.debug(result);
					logger.info(`Uploaded ${collectionName} to remote storage.`);
				}).catch(error => {
					logger.error(`A storage error occured: ${error}`);
				});

		}
		catch(error) {
			logger.error(`A storage error occured: ${error}`);
		}

	}

};