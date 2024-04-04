import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

export type Todo = {
  isDone: boolean;
  title: string;
  id: string;
  dateCreated: FirebaseFirestoreTypes.Timestamp;
};
