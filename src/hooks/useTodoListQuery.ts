import { getQueryKey } from "@src/react-query/queryKeys";
import { useFirestoreInfiniteQuery } from "@src/react-query/useFirestoreInfiniteQuery";
import firestore from "@react-native-firebase/firestore";
import { Todo } from "@src/firebase/types";

export const useTodoListQuery = (params?: { isDone: boolean }) => {
  let query = firestore()
    .collection("todos")
    .limit(20)
    .orderBy("dateCreated", "asc");

  if (params) {
    query.where("isDone", "==", params.isDone);
  }
  return useFirestoreInfiniteQuery<Todo>(
    getQueryKey(["todos", "todoList"], params),
    query
  );
};
