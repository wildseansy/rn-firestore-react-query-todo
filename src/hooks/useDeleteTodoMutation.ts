import firestore from "@react-native-firebase/firestore";
import { getQueryKey } from "@src/react-query/queryKeys";
import { useFirestoreCollectionDeleteMutation } from "@src/react-query/useFirestoreCollectionDeleteMutation";
import { invalidateTodoList } from "@src/utils/cache";
import { useQueryClient } from "@tanstack/react-query";

export const useDeleteTodoMutation = () => {
  const collectionRef = firestore().collection("todos");
  const queryClient = useQueryClient();

  return useFirestoreCollectionDeleteMutation({
    collectionRef,
    queryKey: getQueryKey(["todos", "todoList"]),
    options: {
      onSuccess: () => {
        invalidateTodoList(queryClient);
      },
    },
  });
};
