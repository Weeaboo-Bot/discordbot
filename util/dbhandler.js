const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const firebaseConfig = require('../config').firebase;

initializeApp({
    credential: cert(firebaseConfig),
});

const db = getFirestore();

module.exports = class DbHandler {

    static async setValue(key, value, collection) {
        return await db.collection(collection).doc(key).set(value);
    }

    static async getValue(key, collection) {
        const doc = await db.collection(collection).doc(key).get();
        if (!doc.exists) {
            console.log('No such document!');
        } else {
            return doc.data();
        }
    }

    static async clearValue(key, collection) {
        return await db.collection(collection).doc(key).delete();
    }

    static async clearAllValues(collection) {
        return await this.deleteCollection(db, collection, 5);
    }

    static async deleteCollection(db, collectionPath, batchSize) {
        const collectionRef = db.collection(collectionPath);
        const query = collectionRef.orderBy('__name__').limit(batchSize);
      
        return new Promise((resolve, reject) => {
          deleteQueryBatch(db, query, resolve).catch(reject);
        });
    }

    static async deleteQueryBatch(db, query, resolve) {
        const snapshot = await query.get();
      
        const batchSize = snapshot.size;
        if (batchSize === 0) {
          // When there are no documents left, we are done
          resolve();
          return;
        }
      
        // Delete documents in a batch
        const batch = db.batch();
        snapshot.docs.forEach((doc) => {
          batch.delete(doc.ref);
        });
        await batch.commit();
      
        // Recurse on the next process tick, to avoid
        // exploding the stack.
        process.nextTick(() => {
          deleteQueryBatch(db, query, resolve);
        });
      }
}