import firestore, {
  FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";
import { UseMutationOptions, useMutation } from "@tanstack/react-query";
import { useCallback } from "react";
import { FirestoreError } from "@src/react-query/types";

// Variables requires an id, so we know which document to reference
type UpdateMutationVariables<D = unknown> = {
  id: string;
  updates: Partial<D>;
};

export const useFirestoreUpdateMutation = <D = unknown>({
  collectionRef,
  options,
}: {
  collectionRef: FirebaseFirestoreTypes.CollectionReference<FirebaseFirestoreTypes.DocumentData>;
  options?: UseMutationOptions<
    void,
    FirestoreError,
    UpdateMutationVariables<D>
  >;
}) => {
  const mutationFn = useCallback(
    async ({ id, updates }: UpdateMutationVariables<D>) => {
      const result = await firestore().runTransaction(() => {
        return collectionRef.doc(id).update(updates);
      });

      return result;
    },
    [collectionRef]
  );
  return useMutation<void, FirestoreError, UpdateMutationVariables<D>>({
    mutationFn,
    ...options,
  });
};
