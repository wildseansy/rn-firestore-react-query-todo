import { getQueryKey } from "@src/react-query/queryKeys";
import { QueryClient } from "@tanstack/query-core";

export const invalidateTodoLists = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({
    queryKey: getQueryKey(["todos", "todoList"]),
  });
  queryClient.invalidateQueries({
    queryKey: getQueryKey(["todos", "listSize"]),
  });
};
