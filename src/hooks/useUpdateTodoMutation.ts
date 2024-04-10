import firestore from "@react-native-firebase/firestore";
import { Todo } from "@src/firebase/types";
import { updateFirestoreCachedData } from "@src/react-query/cache";
import { getQueryKey } from "@src/react-query/queryKeys";
import { FirestoreWrappedData } from "@src/react-query/types";
import { useFirestoreUpdateMutation } from "@src/react-query/useFirestoreUpdateMutation";
import { invalidateTodoLists } from "@src/utils/cache";
import { useQueryClient } from "@tanstack/react-query";

export const useUpdateTodoMutation = () => {
  const collectionRef = firestore().collection("todos");
  const queryClient = useQueryClient();
  return useFirestoreUpdateMutation<Todo>({
    collectionRef,
    options: {
      onSuccess: (_, variables) => {
        const queryKey = getQueryKey(["todos", "todoItem"], {
          todoId: variables.id,
        });
        updateFirestoreCachedData<Todo>({
          queryClient,
          queryFilters: {
            queryKey,
          },
          updater: (cachedItem) => {
            return {
              ...cachedItem,
              ...variables.updates,
            };
          },
        });
        invalidateTodoLists(queryClient);
      },
    },
  });
};
