import { StyleSheet, Button, TextInput } from "react-native";
import firestore from "@react-native-firebase/firestore";
import { getQueryKey } from "@src/react-query/queryKeys";
import { useFirestoreCollectionAddMutation } from "@src/react-query/useFirestoreCollectionAddMutation";
import { useCallback, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { RootUseNavigation } from "@src/utils/navigation";
import { Todo } from "@src/firebase/types";
import { useQueryClient } from "@tanstack/react-query";

const useCreateTodoMutation = () => {
  const collectionRef = firestore().collection("todos");
  const queryClient = useQueryClient();
  return useFirestoreCollectionAddMutation<Todo>({
    collectionRef,
    queryKey: getQueryKey(["todos", "todoList"]),
    cachePosition: "end",
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getQueryKey(["todos", "listSize"]),
          exact: true,
        });
      },
    },
  });
};
export const CreateTodoScreen: React.FC = () => {
  const [todoTitle, setTodoTitle] = useState("");
  const mutation = useCreateTodoMutation();
  const { goBack } = useNavigation<RootUseNavigation<"CreateTodo">>();
  const queryClient = useQueryClient();
  const handleSubmit = useCallback(() => {
    mutation.mutate({
      title: todoTitle,
      isDone: false,
      dateCreated: firestore.Timestamp.fromDate(new Date()),
    });
    goBack();
  }, [todoTitle, mutation.mutate, queryClient]);
  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        placeholder="Enter todo"
        style={styles.input}
        value={todoTitle}
        onChangeText={setTodoTitle}
        returnKeyType="done"
        onSubmitEditing={handleSubmit}
        autoFocus
      />
      <Button onPress={handleSubmit} title="Submit" />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    padding: 12,
    gap: 10,
  },
  input: {
    height: 50,
    paddingHorizontal: 12,
    width: "100%",
    fontSize: 16,
    backgroundColor: "white",
    borderRadius: 5,
    borderColor: "#ababab",
    borderWidth: StyleSheet.hairlineWidth,
  },
});
