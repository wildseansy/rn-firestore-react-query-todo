import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { InfiniteData, UseBaseQueryResult } from "@tanstack/react-query";
export type PageParam =
  | FirebaseFirestoreTypes.Query<FirebaseFirestoreTypes.DocumentData>
  | undefined;

export type FirestoreError = unknown;

export type FirestoreWrappedData<D = unknown> = {
  id: string;
  data: D;
};

export type FirestoreInfiniteQueryPage<D = unknown> = {
  snapshot?: FirebaseFirestoreTypes.QuerySnapshot<FirebaseFirestoreTypes.DocumentData>;
  data: FirestoreWrappedData[];
};

export type PaginatedResponse<T> = InfiniteData<
  FirestoreInfiniteQueryPage<T>,
  PageParam
>;

export type FirestoreQueryResult<D = unknown> = {
  snapshot?: FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData>;
} & FirestoreWrappedData<D>;

export type UseFirestoreQueryResult<D = unknown> = UseBaseQueryResult<
  FirestoreQueryResult<D>
>;
