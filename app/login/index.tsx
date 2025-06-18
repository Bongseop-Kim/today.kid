import React from "react";
import { Stack } from "expo-router";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";

const styles = StyleSheet.create({
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F2",
    borderRadius: 12,
    width: "100%",
    height: 50,
    paddingHorizontal: 20,
  },

  googleIcon: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
});

export default function LoginScreen() {
  return (
    <React.Fragment>
      <Stack.Screen options={{ headerShown: false }} />
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white",
        }}
      >
        <View style={{ flex: 3, justifyContent: "center" }}>
          <Text
            style={{ fontSize: 26, fontWeight: "bold", textAlign: "center" }}
          >
            아이가 아픈 이유가 뭘까요?
          </Text>

          <View style={{ height: 20 }} />

          <Text style={{ fontSize: 18, textAlign: "center" }}>
            날씨처럼 하루하루가 다른
          </Text>
          <Text style={{ fontSize: 18, textAlign: "center" }}>
            아이의 정확한 증상을 알고 싶은
          </Text>
          <Text style={{ fontSize: 18, textAlign: "center" }}>
            엄마들에게 도움이 되고 싶어요.
          </Text>
        </View>

        <View style={{ flex: 1, paddingHorizontal: 20 }}>
          <TouchableOpacity
            style={styles.googleButton}
            onPress={() => {
              console.log("Google로 계속하기");
              GoogleSignin.signIn().then((data) => {
                console.log(data);
              });
            }}
          >
            <Image
              source={require("../../assets/images/google.icon.png")}
              style={styles.googleIcon}
            />

            <Text style={styles.googleButtonText}>Google로 계속하기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </React.Fragment>
  );
}
