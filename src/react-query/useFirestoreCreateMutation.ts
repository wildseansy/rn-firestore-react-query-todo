import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { UseMutationOptions, useMutation } from "@tanstack/react-query";
import { useCallback } from "react";
import { FirestoreError, FirestoreWrappedData } from "@src/react-query/types";

export const useFirestoreCreateMutation = <D = unknown>({
  collectionRef,
  options,
}: {
  collectionRef: FirebaseFirestoreTypes.CollectionReference<FirebaseFirestoreTypes.DocumentData>;
  options?: UseMutationOptions<FirestoreWrappedData<D>, FirestoreError, D>;
}) => {
  const mutationFn = useCallback(
    async (variables: D) => {
      const createdRef = await collectionRef.add(
        variables as FirebaseFirestoreTypes.DocumentData
      );
      const result: FirestoreWrappedData<D> = {
        id: createdRef.id,
        data: variables,
      };
      return result;
    },
    [collectionRef]
  );
  return useMutation<FirestoreWrappedData<D>, FirestoreError, D>({
    mutationFn,
    ...options,
  });
};
