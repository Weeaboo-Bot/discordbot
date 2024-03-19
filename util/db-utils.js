const { initializeApp, applicationDefault } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue, FieldPath } = require('firebase-admin/firestore');

module.exports = class FirestoreDB {
  constructor(config, logger) {
    this.validateConfig(config);
    this.app = initializeApp({
      credential: applicationDefault(),
    });
    this.db = getFirestore(this.app);
  }

  createNowTimestamp() {
    // Get the current date in milliseconds since epoch (Jan 1, 1970)
    const now = Date.now();

    // Convert milliseconds to seconds (Firestore timestamp uses seconds)
    const seconds = Math.floor(now / 1000);

    // Get remaining milliseconds for nanoseconds (Firestore uses nanoseconds too)
    const nanoseconds = now % 1000 * 1000000; // Multiply by 1 million for nanoseconds

    // Return a new Firestore Timestamp object (assuming you have the firebase library)
    return Timestamp.fromDate(new Date(now));
  }

  validateConfig(config) {
    if (!config || !config.client_id || !config.project_id) {
      throw new Error('Invalid Firebase configuration provided!');
    }
  }

  getCollection(collectionName) {
    if (!collectionName) {
      throw new Error('Collection name is required!');
    }
    return this.db.collection(collectionName);
  }

  getCollectionById(collectionName, id) {
    if (!collectionName || !id) {
      throw new Error('Collection name and id are required!');
    }
    return this.db.collection(collectionName).doc(id);
  }

  async addDocument(collectionName, data, autoGenId = true) {
    if (!collectionName || !data) {
      throw new Error('Collection name and data are required!');
    }
    const docRef = await this.getCollection(collectionName).add(data);
    return autoGenId ? docRef.id : docRef;
  }

  async createUser(userCollection, userData, balanceCollection, balanceData, documentId) {
    try {
      const transaction = await this.db.runTransaction(async (transaction) => {
        // Create a reference to the document in the first collection
        const userRef = this.db.collection(userCollection).doc(documentId);
  
        // Create the first document using set()
        userData.createdAt = FieldValue.serverTimestamp();
        userData.updatedAt = FieldValue.serverTimestamp();
        await transaction.set(userRef, userData);
  
        // Get the generated ID of the first document
        const userRefId = userRef.id;
  
        // Create a reference to the document in the second collection
        const balanceRef = this.db.collection(balanceCollection).doc(documentId);
  
        // Modify doc2Data to include a reference to the first document
        balanceData.userId = userRefId;
  
        // Create the second document using set()
        balanceData.createdAt = FieldValue.serverTimestamp();
        balanceData.updatedAt = FieldValue.serverTimestamp();
        await transaction.set(balanceRef, balanceData);
        return userRefId;
      });
      const createdData = await this.getDocument(userCollection, transaction);
      return createdData;
    } catch (error) {
      this.logger.error(`Error creating user ${error}`);
      return null; // Return null for error handling
    }
  }
  // Add records across 2 collections
  async addLinkedDocuments(collectionNameA, dataA, collectionNameB, dataB, documentId) {
    const transaction = await this.db.runTransaction(async (transaction) => {
      // Create a reference to the document in the first collection
      const docRef1 = await this.db.collection(collectionNameA).doc(documentId);

      // Create the first document using set()
      await transaction.set(docRef1, dataA);

      // Get the generated ID of the first document
      const docId1 = docRef1.id;

      // Create a reference to the document in the second collection
      const docRef2 = await this.db.collection(collectionNameB).doc();

      // Modify doc2Data to include a reference to the first document
      dataB.userId = docId1;

      // Create the second document using set()
      await transaction.set(docRef2, dataB);
    });

    return transaction;
  }

  async getDocument(collectionName, documentId) {
    if (!collectionName || !documentId) {
      throw new Error('Collection name and document ID are required!');
    }
    const docSnapshot = await this.getCollection(collectionName).doc(documentId).get();
    return docSnapshot.exists ? docSnapshot.data() : null;
  }

  async getDocs(collectionName) {
    const docs = [];
    const collectionSnapshot = await db.collection(collectionName).get();

    collectionSnapshot.forEach((doc) => {
      docs.push(doc.data()); // Assuming user data is within the document
    });

    return docs;
  }
  
  async getRecordsById(collectionName, id, fieldName) {
    const matchingDocs = [];
    const query = this.db.collection(collectionName)
      .where(fieldName, '==', id);
    const querySnapshot = await query.get();
  
    querySnapshot.forEach((doc) => {
      matchingDocs.push(doc.data());
    });
  
    return matchingDocs;
  }

  async getMatchingRecords(collectionA, collectionB) {
    const matchingIds = [];

    // Get all documents from collection A and filter by ID
    const collectionASnapshot = await this.db.collection(collectionA)
      .where(FieldPath.documentId(), 'in', collectionB) // Filter by IDs in collectionB
      .get();
    collectionASnapshot.forEach((doc) => {
      matchingIds.push(doc.id);
    });

    // Filter documents from collection B based on matching IDs
    const matchingDocs = [];
    const collectionBSnapshot = await this.db.collection(collectionB)
      .where(FieldPath.documentId(), 'in', matchingIds)
      .get();
    collectionBSnapshot.forEach((doc) => {
      matchingDocs.push(doc.data());
    });

    return matchingDocs;
  }


  // Implement updateDocument and deleteDocument as needed
  async updateDocument(collectionName, documentId, data) {
    if (!collectionName || !documentId || !data) {
      throw new Error('Collection name, document ID, and data are required!');
    }
    await this.getCollection(collectionName).doc(documentId).update(data);
  }
  async updateValueInDoc(collectionName, docId, fieldToUpdate, updateAmount) {

    try {
      const docRef = this.db.collection(collectionName).doc(docId);
      const docSnapshot = await this.db.runTransaction(async (transaction) => {
        const doc = await transaction.get(docRef);

        // Check if document exists
        if (!doc.exists) {
          throw new Error(`Document ${docId} does not exist in collection ${collectionName}`);
        }

        const currentFieldValue = doc.data()[fieldToUpdate];
        const newFieldValue = currentFieldValue + updateAmount;

        // Update the document in the transaction
        transaction.update(docRef, { [fieldToUpdate]: newFieldValue });

        // Return the updated document data (optional)
        return { [fieldToUpdate]: newFieldValue };
      });

      console.log(`Successfully updated ${fieldToUpdate} in document ${docId}`);
      return docSnapshot; // Optional: Return the updated data snapshot
    } catch (error) {
      console.error("Error updating document:", error);
    }
  }
  async deleteDocument(collectionName, documentId) {
    if (!collectionName || !documentId) {
      throw new Error('Collection name and document ID are required!');
    }
    await this.getCollection(collectionName).doc(documentId).delete();
    return true; // Return true for success or false for failure
  }
}
