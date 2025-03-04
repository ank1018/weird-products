import { db } from "@/firebase/config";
import { collection, getDocs } from "firebase/firestore";

export default async function getProducts() {
    const querySnapshot = await getDocs(collection(db, "products"));
    const products = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return products;
}
