import { initializeApp } from "firebase/app";
import { getDatabase, ref, child, get, set } from "firebase/database";
/**
 * Class for interaction with firebase
 * this class is capable of: receiving, deleting and sending data
 */
export class FirebaseDB {
	constructor(config) {
		initializeApp(config);

		this.db = getDatabase();
		this.dbRef = ref(this.db);
	}

	async get(link) {
		const data = await get(child(this.dbRef, link)).then(snap => {
			if (snap.exists()) {
				return snap.toJSON();
			} else return null;
		})

		return data
	}

	async delete(link) {
		await set(ref(this.db, link), null);
	} 

	async push(link, data) {
		const id = data.id;
		delete data.id;
		let JSONData = {};
		JSONData[id] = {...data}
		await set(ref(this.db, link), JSONData)
	}
}