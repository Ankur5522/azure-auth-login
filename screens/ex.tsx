import React, {useState} from "react";
import {Button, Text, View} from "react-native";
import AzureAuth from "react-native-azure-auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const azureAuth = new AzureAuth({
  clientId: "aab976f9-e2bb-42f3-ba90-6fe1ff149c7d",
  tenant: "common",
  redirectUri: "com.login://oauth/redirect/",
});

const Login = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [error, setError] = useState(null);

  const MicrosoftLogin = async () => {
    try {
    //   await azureAuth.webAuth.clearSession();
      const tokens = await azureAuth.webAuth.authorize({
        scope: "openid profile User.Read Mail.Read",
      });
      await AsyncStorage.setItem("accessToken", tokens.accessToken);
      setAccessToken(tokens);
      console.log("Received tokens:", tokens);
    } catch (error) {
      setError(error);
    }
  };

    const MicrosoftLogout = async () => {
        try {
            await azureAuth.webAuth.clearSession();
            // await AsyncStorage.removeItem("accessToken");
            setAccessToken(null);
        } catch (error) {
            setError(error);
        }
    }

  return (
    <View>
      <Button title="Login" onPress={MicrosoftLogin} />
      {accessToken && (
        <View>
            <Text>Hello! {accessToken.userName}</Text>
            <Button title="Logout" onPress={MicrosoftLogout} />
        </View>
      )}

    </View>
  );
};

export default Login;
