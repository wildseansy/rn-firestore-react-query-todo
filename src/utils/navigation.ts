import { NavigationProp, RouteProp } from "@react-navigation/native";

export type RootLoggedInRoutes = {
  TodoList: undefined;
  CreateTodo: undefined;
  TodoItem: {
    id: string;
  };
};

export type RootUseNavigation<K extends keyof RootLoggedInRoutes> =
  NavigationProp<RootLoggedInRoutes, K>;

export type RootUseRoute<K extends keyof RootLoggedInRoutes> = RouteProp<
  RootLoggedInRoutes,
  K
>;
