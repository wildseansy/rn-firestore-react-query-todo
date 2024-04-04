import { StyleSheet, Button, Text, TouchableOpacity } from "react-native";
import auth from "@react-native-firebase/auth";

import {
  NavigationContainer,
  NavigationContainerRef,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { QueryClientProvider } from "@tanstack/react-query";
import { initReactQuery } from "@src/react-query/init";
import { RootLoggedInRoutes } from "@src/utils/navigation";
import { TodoListScreen } from "@src/components/TodoListScreen";
import { TodoItemScreen } from "@src/components/TodoItemScreen";
import { CreateTodoScreen } from "@src/components/CreateTodoScreen";
import { useRef } from "react";

const Stack = createNativeStackNavigator<RootLoggedInRoutes>();

const queryClient = initReactQuery();

export const RootSignedInNav: React.FC = () => {
  const navContainerRef =
    useRef<NavigationContainerRef<RootLoggedInRoutes> | null>(null);

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer ref={navContainerRef}>
        <Stack.Navigator initialRouteName="TodoList">
          <Stack.Screen
            name="TodoList"
            component={TodoListScreen}
            options={{
              title: "Todos",
              headerRight: (nav) => (
                <TouchableOpacity
                  onPress={() =>
                    navContainerRef.current?.navigate("CreateTodo")
                  }
                >
                  <Text
                    style={{ color: "blue", fontWeight: "bold", fontSize: 16 }}
                  >
                    +
                  </Text>
                </TouchableOpacity>
              ),
              headerLeft: () => (
                <Button title="Sign out" onPress={() => auth().signOut()} />
              ),
            }}
          />
          <Stack.Screen
            name="TodoItem"
            component={TodoItemScreen}
            options={{
              title: "",
            }}
          />
          <Stack.Screen
            name="CreateTodo"
            component={CreateTodoScreen}
            options={{
              title: "Create Todo",
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </QueryClientProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
