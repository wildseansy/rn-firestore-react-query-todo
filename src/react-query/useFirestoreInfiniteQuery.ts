import {
  InfiniteData,
  QueryFunction,
  QueryKey,
  UndefinedInitialDataInfiniteOptions,
  useInfiniteQuery,
  UseInfiniteQueryResult,
} from "@tanstack/react-query";
import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { useIsFocused } from "@react-navigation/native";
import {
  FirestoreError,
  FirestoreInfiniteQueryPage,
  PageParam,
} from "@src/react-query/types";
import { oneMinuteCache } from "@src/react-query/cache";

export type UseFirestoreInfiniteQueryOptions<D = unknown> = Omit<
  UndefinedInitialDataInfiniteOptions<
    FirestoreInfiniteQueryPage<D>,
    FirestoreError,
    InfiniteData<FirestoreInfiniteQueryPage<D>, PageParam>,
    QueryKey,
    PageParam
  >,
  "queryFn" | "getNextPageParam"
>;

export type UseFirestoreInfiniteQueryResult<D = unknown> =
  UseInfiniteQueryResult<
    InfiniteData<FirestoreInfiniteQueryPage<D>, PageParam>,
    FirestoreError
  >;

export function useFirestoreInfiniteQuery<D extends { id: string }>(
  key: QueryKey,
  firestoreQuery: FirebaseFirestoreTypes.Query<FirebaseFirestoreTypes.DocumentData>,
  options?: UseFirestoreInfiniteQueryOptions<D>
): UseFirestoreInfiniteQueryResult<D> {
  // Enabled should never be conditionally passed in, this will cause a useHook violation
  const enabled =
    "enabled" in (options ?? {}) ? options?.enabled : useIsFocused();
  const queryFn: QueryFunction<
    FirestoreInfiniteQueryPage<D>,
    QueryKey,
    PageParam
  > = async ({ pageParam }) => {
    const query: FirebaseFirestoreTypes.Query<FirebaseFirestoreTypes.DocumentData> =
      pageParam ?? firestoreQuery;
    try {
      const snapshot = await query.get({ source: "server" });
      const result: FirestoreInfiniteQueryPage<D> = {
        data: snapshot.docs.map((doc) => {
          const deserializedData: D = doc.data() as D;
          return {
            data: deserializedData,
            id: doc.id,
          };
        }),
        snapshot,
      };
      return result;
    } catch (e) {
      // Add global error handler here if needed
      // handleError(e);
      throw e;
    }
  };
  return useInfiniteQuery<
    FirestoreInfiniteQueryPage<D>,
    FirestoreError,
    InfiniteData<FirestoreInfiniteQueryPage<D>, PageParam>,
    QueryKey,
    PageParam
  >({
    queryKey: key,
    queryFn,
    initialPageParam: undefined,
    getNextPageParam: (lastQueryResult: FirestoreInfiniteQueryPage<D>) => {
      const lastDocument = lastQueryResult.snapshot?.docs.at(-1);
      if (lastQueryResult.data.length === 0) {
        // No more results left
        return;
      }
      return lastDocument
        ? firestoreQuery.startAfter(lastDocument)
        : firestoreQuery;
    },
    enabled,
    ...oneMinuteCache,
    ...options,
  });
}

export const getIsLoadingMore = <D>(
  query: UseInfiniteQueryResult<FirestoreInfiniteQueryPage<D>>
) => Boolean(!query.isLoading && !query.isError && query.hasNextPage);
