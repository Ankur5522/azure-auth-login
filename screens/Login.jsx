import React, { useEffect, useState } from "react";
import { Button, Text, View } from "react-native";
import AzureAuth from "react-native-azure-auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const azureAuth = new AzureAuth({
  clientId: "YOUR_CLIENT", // Your client Id from Azure AD
  tenant: "common",
  redirectUri: "com.login://oauth/redirect/",
});

const Login = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const token = await AsyncStorage.getItem("accessToken");
        if (token) {
          setAccessToken(JSON.parse(token));
        }
      } catch (error) {
        setError(error);
      }
    };
    fetchToken();
  }, []);

  const login = async () => {
    try {
      const tokens = await azureAuth.webAuth.authorize({
        scope: "openid profile User.Read Mail.Read",
      });
      const tokensString = JSON.stringify(tokens);
      await AsyncStorage.setItem("accessToken", tokensString);
      setAccessToken(tokens);
      console.log("Received tokens:", tokens);
    } catch (error) {
      console.error("Error during login:", error);
      setError(error);
    }
  };

  const logout = async () => {
    try {
      await azureAuth.webAuth.clearSession();
      await azureAuth.auth.clearPersistenCache();
      await AsyncStorage.removeItem("accessToken");
      setAccessToken(null);
    } catch (error) {
      console.error("Error during logout:", error);
      setError(error);
    }
  };

  return (
    <View>
      {accessToken ? (
        <>
          <Text>Hello: {accessToken.userName}</Text>
          <Button title="Logout" onPress={logout} />
        </>
      ) : (
        <Button title="Login" onPress={login} />
      )}
      {error && <Text>Error: {error.message}</Text>}
    </View>
  );
};

export default Login;
