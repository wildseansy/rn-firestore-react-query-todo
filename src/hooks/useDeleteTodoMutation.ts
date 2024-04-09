import firestore from "@react-native-firebase/firestore";
import { Todo } from "@src/firebase/types";
import { deleteFromPaginatedCache } from "@src/react-query/cache";
import { getQueryKey } from "@src/react-query/queryKeys";
import { useFirestoreDeleteMutation } from "@src/react-query/useFirestoreDeleteMutation";
import { invalidateTodoList } from "@src/utils/cache";
import { useQueryClient } from "@tanstack/react-query";

export const useDeleteTodoMutation = () => {
  const collectionRef = firestore().collection("todos");
  const queryClient = useQueryClient();

  return useFirestoreDeleteMutation({
    collectionRef,
    options: {
      onSuccess: (_, variables) => {
        deleteFromPaginatedCache<Todo>({
          queryClient,
          queryFilters: {
            queryKey: getQueryKey(["todos", "todoList"]),
          },
          shouldDelete: (todo) => todo.id === variables.id,
        });
        invalidateTodoList(queryClient);
      },
    },
  });
};
