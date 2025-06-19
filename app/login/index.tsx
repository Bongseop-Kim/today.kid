import React from "react";
import { View, Text } from "react-native";
import Ios from "@/components/Ios";
import Google from "@/components/Google";
import Kakao from "@/components/Kakao";

export default function LoginScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
      }}
    >
      <View style={{ flex: 3, justifyContent: "center" }}>
        <Text style={{ fontSize: 26, fontWeight: "bold", textAlign: "center" }}>
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

      <View style={{ width: "100%", flex: 1, padding: 20 }}>
        <Google />

        <View style={{ height: 20 }} />
        <Ios />

        <View style={{ height: 20 }} />
        <Kakao />
      </View>
    </View>
  );
}
