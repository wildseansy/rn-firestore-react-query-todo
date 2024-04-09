import { StyleSheet, Text, View, Button } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { RootUseNavigation, RootUseRoute } from "@src/utils/navigation";
import { useEffect } from "react";
import { useUpdateTodoMutation } from "@src/hooks/useUpdateTodoMutation";
import { useDeleteTodoMutation } from "@src/hooks/useDeleteTodoMutation";
import { useTodoItemQuery } from "@src/hooks/useTodoItemQuery";

export const TodoItemScreen: React.FC = () => {
  const { params } = useRoute<RootUseRoute<"TodoItem">>();
  const { setOptions, goBack } = useNavigation<RootUseNavigation<"TodoItem">>();
  const { data } = useTodoItemQuery({ id: params.id });
  useEffect(() => {
    setOptions({ title: data?.data.title });
  }, [data]);
  const updateTodoMutation = useUpdateTodoMutation();
  const deleteTodoMutation = useDeleteTodoMutation();
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 24 }}>
        "{data?.data.title}" is {data?.data.isDone ? "complete" : "incomplete"}
      </Text>
      <View style={styles.buttons}>
        <Button
          title={data?.data.isDone ? "Set to incomplete" : "Complete task"}
          onPress={() => {
            updateTodoMutation.mutate({
              id: params.id,
              updates: {
                isDone: !data?.data.isDone,
              },
            });
          }}
        />
        <Button
          title={"Delete task"}
          color="red"
          onPress={() => {
            deleteTodoMutation.mutate({ id: params.id });
            goBack();
          }}
        />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  buttons: {
    gap: 2,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    gap: 20,
    justifyContent: "center",
  },
});
