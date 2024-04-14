import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

export type Todo = {
  isDone: boolean;
  title: string;
  dateCreated: FirebaseFirestoreTypes.Timestamp;
};
