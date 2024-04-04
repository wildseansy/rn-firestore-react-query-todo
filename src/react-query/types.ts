import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import {
  InfiniteData,
  UseBaseQueryResult,
  UseInfiniteQueryResult,
} from "@tanstack/react-query";
export type PageParam =
  | FirebaseFirestoreTypes.Query<FirebaseFirestoreTypes.DocumentData>
  | undefined;

export type FirestoreError = unknown;
export type FirestoreInfiniteQueryPage<D = unknown> = {
  snapshot?: FirebaseFirestoreTypes.QuerySnapshot<FirebaseFirestoreTypes.DocumentData>;
  data: D[];
};

export type PaginatedResponse<T> = InfiniteData<
  FirestoreInfiniteQueryPage<T>,
  PageParam
>;

export type FirestoreQueryResult<D = unknown> = {
  snapshot?: FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData>;
  data: D;
};

export type UseFirestoreQueryResult<D = unknown> = UseBaseQueryResult<
  FirestoreQueryResult<D>
>;
