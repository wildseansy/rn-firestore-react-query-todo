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
import { updateFirestoreCachedData } from "./cache";

export const useFirestoreUpdateMutation = <D = unknown>({
  queryKey,
  ref,
  updateCacheItem = true,
  options,
}: {
  queryKey: QueryKey;
  ref: FirebaseFirestoreTypes.DocumentReference<FirebaseFirestoreTypes.DocumentData>;
  updateCacheItem?: boolean;
  options?: UseMutationOptions<void, FirestoreError, Partial<D>>;
}) => {
  const queryClient = useQueryClient();
  const mutationFn = useCallback(
    async (variables: Partial<D>) => {
      const result = await firestore().runTransaction(() => {
        return ref.update(variables);
      });
      if (updateCacheItem) {
        updateFirestoreCachedData<D>({
          queryClient,
          queryFilters: {
            queryKey,
          },
          updater: (cachedItem) => {
            return {
              ...cachedItem,
              ...variables,
            };
          },
        });
      }
      return result;
    },
    [ref]
  );
  return useMutation<void, FirestoreError, Partial<D>>({
    mutationKey: queryKey,
    mutationFn,
    ...options,
  });
};
