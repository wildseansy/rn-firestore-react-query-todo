import {
  QueryFunction,
  QueryKey,
  UseQueryOptions,
  useQuery,
} from "@tanstack/react-query";
import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { useIsFocused } from "@react-navigation/native";
import { FirestoreError, FirestoreQueryResult } from "@src/react-query/types";
import { oneMinuteCache } from "@src/react-query/cache";

export type UseFirestoreQueryOptions<D = unknown> = UseQueryOptions<
  FirestoreQueryResult<D>,
  FirestoreError
>;

export function useFirestoreQuery<D = unknown>(
  key: QueryKey,
  firestoreQuery: FirebaseFirestoreTypes.DocumentReference<FirebaseFirestoreTypes.DocumentData>,
  options?: UseFirestoreQueryOptions<D>
) {
  // Enabled should never be conditionally passed in, this will cause a useHook violation
  const enabled =
    "enabled" in (options ?? {}) ? options?.enabled : useIsFocused();
  const queryFn: QueryFunction<
    FirestoreQueryResult<D>,
    QueryKey
  > = async () => {
    try {
      const snapshot = await firestoreQuery.get({ source: "server" });
      const deserializedData: D = snapshot.data() as D;

      const result: FirestoreQueryResult<D> = {
        data: deserializedData,
        snapshot,
      };
      return result;
    } catch (e) {
      // Global error handler, possibly log to sentry/bugsnag...etc
      // handleError(e);
      throw e;
    }
  };
  const query = useQuery<FirestoreQueryResult<D>, FirestoreError>({
    queryKey: key,
    queryFn,
    enabled,
    ...oneMinuteCache,
    ...options,
  });
  return query;
}
