import NetInfo from "@react-native-community/netinfo";
import { QueryClient, onlineManager } from "@tanstack/react-query";

export const initReactQuery = () => {
  const queryClient = new QueryClient();

  onlineManager.setEventListener((setOnline) => {
    return NetInfo.addEventListener((state) => {
      setOnline(!!state.isConnected);
    });
  });
  return queryClient;
};
