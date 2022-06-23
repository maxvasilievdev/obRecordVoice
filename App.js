import * as React from "react";
import { View, Text } from "react-native";
import { gStyle } from "./components/style";
import * as Font from "expo-font";
import { useState, useEffect, useCallback } from "react";
import * as SplashScreen from "expo-splash-screen";
// import { Audio } from "expo-av";
// import { Card, Background, Title, Appbar } from "react-native-paper";
// import { Header } from "react-native/Libraries/NewAppScreen";

// import { gStyle } from "./components/style";
// import * as Font from "expo-font";
// import { useState, useEffect, useCallback } from "react";
// import * as SplashScreen from "expo-splash-screen";
import MainF from "./navigate";
import VoiceList from "./navigate";
import * as FileSystem from "expo-file-system";
//import HeaderOb from "./components/Header";
//import MainF from "./components/Main";

// const fonts = () =>
//   Font.loadAsync({
//     im: require("./assets/Fonts/Inter-Medium.ttf"),
//     tgReg: require("./assets/Fonts/TiroGurmukhi-Regular.ttf"),
//     tgIt: require("./assets/Fonts/TiroGurmukhi-Italic.ttf"),
//   });

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  React.useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync();
        //await Font.loadAsync(Entypo.font);
        const fonts = await Font.loadAsync({
          im: require("./assets/Fonts/Inter-Medium.ttf"),
          ib: require("./assets/Fonts/Inter-Bold.ttf"),
          tgReg: require("./assets/Fonts/TiroGurmukhi-Regular.ttf"),
          tgIt: require("./assets/Fonts/TiroGurmukhi-Italic.ttf"),
        });
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  // useEffect(() => {
  //   try {
  //     const dirL = FileSystem.readDirectoryAsync(
  //       FileSystem.documentDirectory + "tmpForUpload"
  //     );
  //   } catch (error) {
  //     console.log(error);
  //   }
  // });

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }
  return (
    <View style={gStyle.container} onLayout={onLayoutRootView}>
      <MainF />
    </View>
  );
}
