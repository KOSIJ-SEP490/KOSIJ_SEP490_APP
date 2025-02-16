import React from "react";
import AppNavigator from "./AppNavigator";
import HomeScreen from "../../apps/customer/screens/navbar/HomeScreen";
import TripsScreen from "../../apps/customer/screens/navbar/TripsScreen";
import NotificationsScreen from "../../apps/customer/screens/navbar/NotificationsScreen";
import OrdersScreen from "../../apps/customer/screens/navbar/OrdersScreen";
import SettingsScreen from "../../apps/customer/screens/navbar/SettingsScreen";

export default function CustomerNavigator() {
  return (
    <AppNavigator
      screens={[
        { name: "Home", component: HomeScreen, icon: "home" },
        { name: "Trips", component: TripsScreen, icon: "map" },
        { name: "Orders", component: OrdersScreen, icon: "cart" },
        {
          name: "Notifications",
          component: NotificationsScreen,
          icon: "notifications",
        },
        { name: "Settings", component: SettingsScreen, icon: "settings" },
      ]}
    />
  );
}
