import React from "react";
import { View, ActivityIndicator } from "react-native";
import CustomerNavigator from "../../shared/navigation/CustomerNavigator";
import AuthNavigator from "../../shared/navigation/AuthNavigator";
import AuthContext, { AuthProvider } from "../../shared/context/AuthContext";
import { NavigationContainer } from "@react-navigation/native";
import DeliveryNavigator from "../../shared/navigation/DeliveryNavigator";

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <MainNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}

const MainNavigator = () => {
  const authContext = React.useContext(AuthContext);

  if (!authContext) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const { user, loading } = authContext;

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return user ? <DeliveryNavigator /> : <AuthNavigator />;
};
