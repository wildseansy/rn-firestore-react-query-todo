import firestore, {
  FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";
import {
  QueryKey,
  UseMutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useCallback } from "react";
import { FirestoreError } from "@src/react-query/types";
import { deleteFromPaginatedCache } from "@src/react-query/cache";
import { Todo } from "@src/firebase/types";

export const useFirestoreCollectionDeleteMutation = ({
  queryKey,
  collectionRef,
  options,
}: {
  queryKey: QueryKey;
  collectionRef: FirebaseFirestoreTypes.CollectionReference<FirebaseFirestoreTypes.DocumentData>;
  options?: UseMutationOptions<void, FirestoreError, { id: string }>;
}) => {
  const queryClient = useQueryClient();
  const mutationFn = useCallback(
    async ({ id: docId }: { id: string }) => {
      const result = await firestore().runTransaction(() => {
        return collectionRef.doc(docId).delete();
      });
      deleteFromPaginatedCache<Todo>({
        queryClient,
        queryFilters: {
          queryKey,
        },
        shouldDelete: (todo) => todo.id === docId,
      });
      return result;
    },
    [collectionRef, queryKey]
  );
  return useMutation<void, FirestoreError, { id: string }>({
    mutationKey: queryKey,
    mutationFn,
    ...options,
  });
};
