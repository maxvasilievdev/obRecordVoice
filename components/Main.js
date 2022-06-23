import * as React from "react";
import {
  Text,
  View,
  StyleSheet,
  Button,
  Image,
  TouchableOpacity,
  useReducer,
  useEffect,
  useRef,
} from "react-native";
import { gStyle } from "./style";
import { Audio } from "expo-av";
import { Card, Title } from "react-native-paper";
//import Timer from "./Timer";
import { DateTime, Duration, DurationUnits } from "luxon";
import "intl";
import "intl/locale-data/jsonp/en";
import { format, getDate, getHours } from "date-fns";
import { Recording } from "expo-av/build/Audio";
import * as FileSystem from "expo-file-system";
//import App from "../App";
//import FTP from "react-native-ftp";
//import oracledb from "oracledb";

const initialState = {
  isRunning: false,
  time: 0,
  hr: 0,
  mn: 0,
  sc: 0,
  timeString: "00:00:00",
  tStart: 0,
  tStop: 0,
};

//const oracledb = require("oracledb");

// const ftp = require("basic-ftp");

function getDT() {
  return (
    (Number(DateTime.local().day) < 10
      ? "0" + String(DateTime.local().day)
      : String(DateTime.local().day)) +
    (Number(DateTime.local().month) < 10
      ? "0" + String(DateTime.local().month)
      : String(DateTime.local().month)) +
    String(DateTime.local().year) +
    "_" +
    (Number(DateTime.local().hour) < 10
      ? "0" + String(DateTime.local().hour)
      : String(DateTime.local().hour)) +
    "-" +
    (Number(DateTime.local().minute) < 10
      ? "0" + String(DateTime.local().minute)
      : String(DateTime.local().minute)) +
    "-" +
    (Number(DateTime.local().second) < 10
      ? "0" + String(DateTime.local().second)
      : String(DateTime.local().second))
  );
}

// async function loadToAIS(tStrt, tStpp, userN, sLinkF) {
//   try {
//     // connection = await oracledb.getConnection({
//     //   user: "U19598",
//     //   password: "o93wwdw",
//     //   connectString: "AIS_192.168.0.210",
//     // });
//     // console.log(connection);
//     // const result = await connection.execute(
//     //   `exec adm.put_record(
//     //     :p_date_start,
//     //     :p_date_end,
//     //     :p_ora_user varchar2,
//     //     :p_ftp_link varchar2)`,
//     //   [DateTime.local()],
//     //   [DateTime.local()],
//     //   [userN],
//     //   [sLinkF]
//     // );
//   } catch (error) {
//     console.log("ORACLE : " + error);
//   }
// }

async function uploadF(fSource, fName) {
  try {
    //const sLinkF = "http://192.168.1.36/AISaudio/" + fName;
    const res = await FileSystem.uploadAsync(
      "http://192.168.1.36/AISaudio/",
      fSource,
      {
        headers: {},
        uploadType: FileSystem.FileSystemUploadType.MULTIPART,
      }
    );
    console.log("RES : " + res);
    if (res.status === 200) {
      console.log("ALL OK");
      //await loadToAIS(tStrt, tStpp, "U87", sLinkF);
      await FileSystem.deleteAsync(fSource);
    }
  } catch (error) {
    console.log(error);
  }
}

async function moveRecFile(fromS, tStr, tStp) {
  try {
    await FileSystem.makeDirectoryAsync(
      FileSystem.documentDirectory + "tmpForUpload",
      { intermediates: true }
    );

    const destF =
      FileSystem.documentDirectory +
      "tmpForUpload/" +
      tStr +
      "_" +
      tStp +
      ".m4a";
    console.log("prep move : " + fromS + "->" + destF);

    FileSystem.moveAsync({
      from: fromS,
      to: destF,
    });

    uploadF(destF, tStr + "_" + tStp + ".m4a");
  } catch (error) {
    console.log(error);
  }
}

export default function Main({ navigation }) {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const idRef = React.useRef(0);

  React.useEffect(() => {
    if (!state.isRunning) {
      return;
    }
    idRef.current = setInterval(() => dispatch({ type: "tick" }), 1000);
    return () => {
      clearInterval(idRef.current);
      idRef.current = 0;
    };
  }, [state.isRunning]);

  const loadSet = () => {
    navigation.navigate("Settings");
  };
  const loadList = () => {
    navigation.navigate("List");
  };
  const [recording, setRecording] = React.useState();
  const [tStart, setStart] = React.useState(() => {
    return getDT();
  });
  const [tStop, setStop] = React.useState(() => {
    return getDT();
  });

  async function startRecording() {
    try {
      console.log("Requesting permissions..");
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      console.log("Starting recording..");
      const { recording } = await Audio.Recording.createAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      setStart(getDT());
      setRecording(recording);
      console.log("Recording started : ");

      dispatch({ type: "start" });
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }

  async function stopRecording() {
    console.log("Stopping recording..");
    setStop(getDT());
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    console.log("Recording stopped and stored at", uri);
    dispatch({ type: "stop" });
    console.log("before move : " + tStart + " : " + getDT());
    const tSt = getDT();
    moveRecFile(uri, tStart, tSt);

    const dirList = await FileSystem.readDirectoryAsync(
      FileSystem.documentDirectory + "tmpForUpload"
    );
    console.log("List : " + dirList);
    // dirList.forEach((element) => {
    //   FileSystem.deleteAsync(
    //     FileSystem.documentDirectory + "tmpForUpload/" + element
    //   );
    //   console.log("Clear : " + element);
    // });
  }

  return (
    <View>
      <Card style={gStyle.cardsTop}></Card>
      <Card style={gStyle.cards}>
        <TouchableOpacity onPress={recording ? stopRecording : startRecording}>
          <Text style={gStyle.textTime}>{state.timeString}</Text>
          {
            // <Text>
            //   {tStart} : {tStop}
            // </Text>
          }
          <Image
            source={
              recording
                ? require("../assets/microphone_ON.png")
                : require("../assets/microphone_OFF.png")
            }
          />
        </TouchableOpacity>
        <Text style={gStyle.textRec}>
          {recording ? "ИДЕТ   ЗАПИСЬ" : "ОСТАНОВЛЕНО"}
        </Text>
      </Card>
      <Image source={require("../assets/Obuhov.png")} />
    </View>
  );
}

function reducer(state, action) {
  switch (action.type) {
    case "start":
      return {
        ...state,
        isRunning: true,
        timeString: "00:00:00",
        hr: 0,
        mn: 0,
      };
    case "stop":
      return {
        ...state,
        isRunning: false,
        time: 0,
        timeString: "00:00:00",
        hr: 0,
        mn: 0,
      };
    case "reset":
      return { isRunning: false, time: 0 };
    case "tick":
      if (state.time === 60) {
        state.mn = state.mn + 1;
        state.time = 0;
      }
      if (state.mn === 60) {
        state.hr = state.hr + 1;
        state.mn = 0;
        state.time = 0;
      }
      if (state.hr === 24) {
        state.hr = 0;
        state.mn = 0;
        state.time = 0;
      }
      state.timeString =
        ("0" + state.hr).slice(-2) +
        ":" +
        ("0" + state.mn).slice(-2) +
        ":" +
        ("0" + state.time).slice(-2);
      return { ...state, time: state.time + 1 };
    default:
      throw new Error();
  }
}
