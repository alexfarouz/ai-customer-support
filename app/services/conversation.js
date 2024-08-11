import { db } from '../../firebase';
import { collection, addDoc, getDocs, query, where, doc, setDoc } from 'firebase/firestore';

export async function fetchConversations(userId) {
  try {
    const conversationsQuery = query(
      collection(db, "users", userId, "conversations")
    );
    const querySnapshot = await getDocs(conversationsQuery);
    const conversations = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return conversations;
  } catch (e) {
    console.error("Error fetching conversations for User ID:", userId, e);
    throw e;
  }
}

export async function saveConversation(conversation, userId) {
  try {
    const docRef = await addDoc(collection(db, "users", userId, "conversations"), {
      messages: conversation,
      timestamp: new Date(),
    });
    return docRef;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
}

export async function updateConversation(conversationId, conversation, userId) {
  try {
    const conversationRef = doc(db, "users", userId, "conversations", conversationId);
    await setDoc(conversationRef, {
      messages: conversation,
      timestamp: new Date(),
    });
  } catch (e) {
    console.error("Error updating document: ", e);
    throw e;
  }
}
