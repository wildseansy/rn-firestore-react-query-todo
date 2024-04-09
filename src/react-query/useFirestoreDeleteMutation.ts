import firestore, {
  FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";
import { UseMutationOptions, useMutation } from "@tanstack/react-query";
import { useCallback } from "react";
import { FirestoreError } from "@src/react-query/types";

type DeleteMutationVariables = { id: string };

export const useFirestoreDeleteMutation = ({
  collectionRef,
  options,
}: {
  collectionRef: FirebaseFirestoreTypes.CollectionReference<FirebaseFirestoreTypes.DocumentData>;
  options?: UseMutationOptions<void, FirestoreError, DeleteMutationVariables>;
}) => {
  const mutationFn = useCallback(
    async ({ id: docId }: DeleteMutationVariables) => {
      const result = await firestore().runTransaction(() => {
        return collectionRef.doc(docId).delete();
      });
      return result;
    },
    [collectionRef]
  );
  return useMutation<void, FirestoreError, DeleteMutationVariables>({
    mutationFn,
    ...options,
  });
};
