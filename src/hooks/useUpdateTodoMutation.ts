import firestore from "@react-native-firebase/firestore";
import { Todo } from "@src/firebase/types";
import { getQueryKey } from "@src/react-query/queryKeys";
import { useFirestoreUpdateMutation } from "@src/react-query/useFirestoreUpdateMutation";
import { invalidateTodoList } from "@src/utils/cache";
import { useQueryClient } from "@tanstack/react-query";

export const useUpdateTodoMutation = ({ id }: { id: string }) => {
  const ref = firestore().collection("todos").doc(id);
  const queryClient = useQueryClient();

  return useFirestoreUpdateMutation<Todo>({
    ref,
    queryKey: getQueryKey(["todos", "todoItem"], { todoId: id }),
    options: {
      onSuccess: () => {
        invalidateTodoList(queryClient);
      },
    },
  });
};
