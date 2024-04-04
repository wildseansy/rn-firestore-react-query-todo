import firestore from "@react-native-firebase/firestore";
import { Todo } from "@src/firebase/types";
import { getQueryKey } from "@src/react-query/queryKeys";
import { useFirestoreQuery } from "@src/react-query/useFirestoreQuery";

export const useTodoItemQuery = ({ id }: { id: string }) => {
  const query = firestore().collection("todos").doc(id);

  return useFirestoreQuery<Todo>(
    getQueryKey(["todos", "todoItem"], { todoId: id }),
    query
  );
};
