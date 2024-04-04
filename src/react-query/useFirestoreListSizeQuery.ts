import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { QueryKey } from "@tanstack/query-core";
import {
  useQuery,
  UseQueryOptions,
  QueryFunction,
} from "@tanstack/react-query";
import { FirestoreError } from "@src/react-query/types";
export type NumberResult = { data: number };
export type UseFirestoreListSizeQueryOptions = Omit<
  UseQueryOptions<NumberResult, FirestoreError, NumberResult, QueryKey>,
  "queryFn" | "queryKey"
>;

export const useFirestoreListSizeQuery = (
  queryKey: QueryKey,
  firestoreQuery: FirebaseFirestoreTypes.Query<FirebaseFirestoreTypes.DocumentData>,
  options?: UseFirestoreListSizeQueryOptions
) => {
  const queryFn: QueryFunction<NumberResult, QueryKey> = async () => {
    const result = await firestoreQuery.count().get();
    return {
      data: result.data().count,
    };
  };

  return useQuery<NumberResult, FirestoreError, NumberResult, QueryKey>({
    queryKey,
    queryFn,
    ...options,
  });
};
