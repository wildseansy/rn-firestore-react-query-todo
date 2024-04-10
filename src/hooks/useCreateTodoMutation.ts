import firestore from "@react-native-firebase/firestore";
import { Todo } from "@src/firebase/types";
import { insertIntoPaginatedCache } from "@src/react-query/cache";
import { getQueryKey } from "@src/react-query/queryKeys";
import { FirestoreWrappedData } from "@src/react-query/types";
import { useFirestoreCreateMutation } from "@src/react-query/useFirestoreCreateMutation";
import { useQueryClient } from "@tanstack/react-query";

export const useCreateTodoMutation = () => {
  const collectionRef = firestore().collection("todos");
  const queryClient = useQueryClient();
  return useFirestoreCreateMutation<Todo>({
    collectionRef,
    options: {
      onSuccess: (todoCreated) => {
        insertIntoPaginatedCache<FirestoreWrappedData<Todo>>({
          queryClient,
          queryFilters: {
            queryKey: getQueryKey(["todos", "todoList"]),
          },
          entry: todoCreated,
          at: "end",
        });
        queryClient.invalidateQueries({
          queryKey: getQueryKey(["todos", "listSize"]),
          exact: true,
        });
      },
    },
  });
};
