import firestore, {
  FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";
import { getQueryKey } from "@src/react-query/queryKeys";
import { useFirestoreListSizeQuery } from "@src/react-query/useFirestoreListSizeQuery";

export const useTodosCountQuery = (params?: { isDone: boolean }) => {
  let firestoreQuery: FirebaseFirestoreTypes.Query<FirebaseFirestoreTypes.DocumentData> =
    firestore().collection("todos");
  if (params) {
    firestoreQuery = firestoreQuery.where("isDone", "==", params.isDone);
  }

  return useFirestoreListSizeQuery(
    getQueryKey(["todos", "listSize"], params),
    firestoreQuery
  );
};
