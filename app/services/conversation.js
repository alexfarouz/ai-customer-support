import { db } from "../../firebase";
import { collection, addDoc, doc, setDoc, getDocs } from "firebase/firestore";

export async function saveConversation(conversation) {
  try {
    const docRef = await addDoc(collection(db, "conversations"), {
      messages: conversation,
      timestamp: new Date()
    });
    console.log("Conversation written with ID: ", docRef.id);
    return docRef; // Return the document reference
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

export async function updateConversation(conversationId, conversation) {
  try {
    const conversationRef = doc(db, "conversations", conversationId);
    await setDoc(conversationRef, {
      messages: conversation,
      timestamp: new Date()
    });
    console.log("Conversation updated with ID: ", conversationId);
  } catch (e) {
    console.error("Error updating document: ", e);
  }
}

export async function fetchConversations() {
  try {
    const querySnapshot = await getDocs(collection(db, "conversations"));
    const conversations = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return conversations;
  } catch (e) {
    console.error("Error fetching conversations: ", e);
  }
}
