import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import {
  QueryKey,
  UseMutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useCallback } from "react";
import { FirestoreError } from "@src/react-query/types";
import { insertIntoPaginatedCache } from "@src/react-query/cache";

export const useFirestoreCollectionAddMutation = <D = unknown>({
  queryKey,
  collectionRef,
  cachePosition = "start",
  options,
}: {
  queryKey: QueryKey;
  collectionRef: FirebaseFirestoreTypes.CollectionReference<FirebaseFirestoreTypes.DocumentData>;
  cachePosition?: "start" | "end";
  options?: UseMutationOptions<D, FirestoreError, Partial<D>>;
}) => {
  const queryClient = useQueryClient();
  const mutationFn = useCallback(
    async (variables: Partial<D>) => {
      const createdRef = await collectionRef.add(
        variables as FirebaseFirestoreTypes.DocumentData
      );
      const result: D = {
        id: createdRef.id,
        ...(variables as D),
      };
      insertIntoPaginatedCache<D>({
        queryClient,
        queryFilters: {
          queryKey,
        },
        entry: result,
        at: cachePosition,
      });
      return result;
    },
    [collectionRef]
  );
  return useMutation<D, FirestoreError, Partial<D>>({
    mutationKey: queryKey,
    mutationFn,
    ...options,
  });
};
