import * as React from "react";
import { Text, View, StyleSheet, Button } from "react-native";
import { gStyle } from "./style";
import * as FileSystem from "expo-file-system";

async function getFileList() {
  try {
    const dirList = await FileSystem.readDirectoryAsync(
      FileSystem.documentDirectory + "tmpForUpload"
    );
  } catch (error) {
    console.log(error);
  }
}
export default function VoiceList() {
  return (
    <View style={gStyle.textTime}>
      <Text>Список не переданных записей</Text>
      <Text>{dirList}</Text>
    </View>
  );
}
