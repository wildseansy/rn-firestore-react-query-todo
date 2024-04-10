import { StyleSheet, Button, TextInput } from "react-native";
import firestore from "@react-native-firebase/firestore";
import { useCallback, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { RootUseNavigation } from "@src/utils/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useCreateTodoMutation } from "@src/hooks/useCreateTodoMutation";

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
