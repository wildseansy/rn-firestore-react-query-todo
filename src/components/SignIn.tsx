import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "react-native";
import { useCallback } from "react";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import auth from "@react-native-firebase/auth";
GoogleSignin.configure({
  webClientId: process.env.EXPO_FIREBASE_CLIENT_ID,
});
export const SignIn: React.FC = () => {
  const handleSignIn = useCallback(async () => {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    // Get the users ID token
    const { idToken } = await GoogleSignin.signIn();

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
    return auth().signInWithCredential(googleCredential);
  }, []);
  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <Button title="Google Sign-In" onPress={handleSignIn} />
    </SafeAreaView>
  );
};
