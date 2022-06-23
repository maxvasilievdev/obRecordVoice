import React from "react";
import MainF from "./components/Main";
import Settings from "./components/Settings";
import VoiceList from "./components/VoicesList";

import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

const Stack = createStackNavigator();

export default function Navigate() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Main"
          component={MainF}
          options={{
            title: "Главная",
            headerStyle: { backgroundColor: "lightskyblue", height: 100 },
          }}
        />
        <Stack.Screen
          name="Settings"
          component={Settings}
          options={{ title: "Настройки" }}
        />
        <Stack.Screen
          name="List"
          component={VoiceList}
          options={{ title: "Не переданные записи" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
