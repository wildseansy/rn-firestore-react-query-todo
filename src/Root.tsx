import { StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";

import { SignIn } from "./components/SignIn";
import { RootSignedInNav } from "./components/RootSignedInNav";

export const Root: React.FC = () => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>();

  const onAuthStateChanged: FirebaseAuthTypes.AuthListenerCallback = (user) => {
    setUser(user);
    // if (initializing) setInitializing(false);
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (!user) {
    return <SignIn />;
  }

  return <RootSignedInNav />;
};
