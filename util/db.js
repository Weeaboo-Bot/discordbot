const admin = require('firebase-admin');
const logger = require('../util/logger');
const fbConfig = require('../config').fbAdminConfig;
admin.initializeApp({
	credential: admin.credential.cert(fbConfig),
});

const db = admin.firestore();

module.exports = class WeabooDatabase {


	async findOne(collectionName, docID) {
		let result;
		try {
			const ref = await db.collection(collectionName).doc(docID).get();
			if (!ref.exists) {
				result = {
					success: false,
					error: `document with id ${docID} does not exist.`,
				};
			}
			else {
				result = { success: true, document: ref.data() };
			}
		}
		catch (error) {
			logger.error(`A Firebase Error: ${error}`);
			result = { success: false, error: error.message };
		}
		logger.info(`Status: ${result.success}`);
	}

	async findAll(collectionName) {
		let result;
		try {
			const documents = [];
			const data = await db
				.collection(collectionName)
				.orderBy('createdAt', 'desc')
				.get();
			data.forEach(doc => {
				documents.push(doc.data());
			});
			result = { success: true, documents: documents };
		}
		catch (error) {
			logger.error(`A Firebase Error: ${error}`);
			result = { success: false, error: error.message };
		}
		logger.info(`Status: ${result.success}`);
	}

	async createDocument(collectionName, documentData, autoID) {
		let result;
		if(autoID) {
			try {
				await db
					.collection(collectionName)
					.add(documentData);
				result = { success: true, doc: documentData };
			}
			catch (error) {
				logger.error(`A Firebase Error: ${error}`);
				result = { success: false, error: error.message };
			}
			logger.info(`Status: ${result.success}`);
		}
		else {
			try {
				await db
					.collection(collectionName)
					.doc(documentData.id)
					.set(documentData, { merge: true });
				result = { success: true, doc: documentData };
			}
			catch (error) {
				logger.error(`A Firebase Error: ${error}`);
				result = { success: false, error: error.message };
			}
			logger.info(`Status: ${result.success}`);
		}
	}

	async deleteDocument(collectionName, docData) {
		let result;
		try {
			await db
				.collection(collectionName)
				.doc(docData.id)
				.delete()
				.then(res => {
					result = { success: true, time: res.writeTime };
				});
		}
		catch (error) {
			logger.error(`A Firebase Error: ${error}`);
			result = { success: false, error: error.message };
		}
		logger.info(`Status: ${result.success}`);
	}

};