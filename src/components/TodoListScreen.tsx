import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";

import { useFlattenPages } from "@src/react-query/useFlattenPages";
import { useNavigation } from "@react-navigation/native";
import { RootUseNavigation } from "@src/utils/navigation";
import { Todo } from "@src/firebase/types";
import { useTodosCountQuery } from "@src/hooks/useTodosCountQuery";
import { useTodoListQuery } from "@src/hooks/useTodoListQuery";

const TodoItem: React.FC<{ todo: Todo; onPress: () => void }> = ({
  todo,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={{
        height: 50,
        justifyContent: "center",
        paddingHorizontal: 12,
        alignItems: "flex-start",
      }}
      onPress={onPress}
    >
      <Text style={styles.todoItemText}>
        <Text style={{ fontSize: 24 }}>{todo.isDone ? "☑" : "☐"}</Text>{" "}
        {todo.title}
      </Text>
    </TouchableOpacity>
  );
};

export const TodoListScreen: React.FC = () => {
  const { navigate } = useNavigation<RootUseNavigation<"TodoList">>();
  const todoListQuery = useTodoListQuery();
  const data = useFlattenPages(todoListQuery.data);

  const doneCountQuery = useTodosCountQuery({ isDone: true });
  const todosTotalCount = useTodosCountQuery();
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>
          Total Todos: {todosTotalCount.data?.data ?? 0}
        </Text>
        <Text style={styles.headerText}>
          Total Complete: {doneCountQuery.data?.data ?? 0}
        </Text>
      </View>
      <FlatList
        refreshing={todoListQuery.isRefetching}
        onRefresh={todoListQuery.refetch}
        keyExtractor={(item) => item.id}
        style={styles.flatList}
        data={data}
        ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
        renderItem={({ item }) => {
          return (
            <TodoItem
              todo={item.data}
              onPress={() => navigate("TodoItem", { id: item.id })}
            />
          );
        }}
        onEndReached={() => todoListQuery.fetchNextPage()}
      />

      <StatusBar style="auto" />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  flatList: { flex: 1, width: "100%" },
  todoItemText: { lineHeight: 24, color: "blue", fontSize: 18 },
  itemSeparator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#adadad",
    width: "100%",
  },
  header: {
    width: "100%",
    height: 70,
    paddingHorizontal: 12,
    justifyContent: "center",
  },
  headerText: {
    fontSize: 18,
  },
});
