import React from "react";
import { StyleSheet } from "react-native";

export const gStyle = StyleSheet.create({
  title: {
    fontSize: 20,
    color: "#333",
  },

  container: {
    flex: 1,
    backgroundColor: "#fff8dc",
  },

  cards: {
    alignItems: "center",
    backgroundColor: "#fff8dc",
    height: 420,
  },
  cardsTop: {
    alignItems: "center",
    backgroundColor: "#fff8dc",
    height: 110,
  },

  textTime: {
    fontSize: 28,
    color: "brown",
    textAlign: "center",
    top: 200,
  },
  textRec: {
    fontSize: 22,
    color: "brown",
    textAlign: "center",
    top: 100,
  },
  textHeader: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
    fontFamily: "ib",
    paddingTop: 30,
    height: 60,
    backgroundColor: "#f0f8ff",
  },
  button: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10,
  },
});
