import React from "react";
import { View, Text, Image } from "react-native";
import Ios from "@/components/Ios";
import Google from "@/components/Google";
import Kakao from "@/components/Kakao";
import { Dimensions } from "react-native";
import { Colors } from "@/constants/Colors";

export default function LoginScreen() {
  const { width, height } = Dimensions.get("window");

  return (
    <View style={{ position: "relative" }}>
      <View
        style={{
          backgroundColor: Colors.light.tint,
          height,
          width,
        }}
      ></View>
      <View
        style={{
          top: 0,
          left: 0,
          height,
          position: "absolute",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <>
          <Image
            source={require("../../assets/images/cloud1.png")}
            style={{
              position: "absolute",
              top: 140,
              left: -40,
              width: 131,
              height: 83,
              opacity: 0.25,
              resizeMode: "contain",
            }}
          />
          <Image
            source={require("../../assets/images/cloud2.png")}
            style={{
              position: "absolute",
              top: 190,
              left: -40,
              width: 106,
              height: 67,
              opacity: 0.25,
              resizeMode: "contain",
            }}
          />

          <Image
            source={require("../../assets/images/cloud2.png")}
            style={{
              position: "absolute",
              top: 340,
              left: 40,
              width: 56,
              height: 36,
              opacity: 0.25,
              resizeMode: "contain",
            }}
          />

          <Image
            source={require("../../assets/images/cloud2.png")}
            style={{
              position: "absolute",
              top: 170,
              right: 60,
              width: 70,
              height: 44,
              opacity: 0.25,
              resizeMode: "contain",
            }}
          />

          <Image
            source={require("../../assets/images/cloud1.png")}
            style={{
              position: "absolute",
              top: 280,
              right: -60,
              width: 131,
              height: 83,
              opacity: 0.25,
              resizeMode: "contain",
            }}
          />
        </>

        <View
          style={{
            flex: 5,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View style={{ height: 90 }} />
          <Image
            source={require("../../assets/images/icon.png")}
            style={{
              width: 200,
              height: 116,
              resizeMode: "contain",
            }}
          />
          <View style={{ height: 80 }} />
          <Text
            style={{
              fontSize: 26,
              fontWeight: "bold",
              textAlign: "center",
              color: "white",
            }}
          >
            아이가 아픈 이유가 뭘까요?
          </Text>

          <View style={{ height: 20 }} />

          <Text style={{ fontSize: 18, textAlign: "center", color: "white" }}>
            날씨처럼 하루하루가 다른
          </Text>
          <Text style={{ fontSize: 18, textAlign: "center", color: "white" }}>
            아이의 정확한 증상을 알고 싶은
          </Text>
          <Text style={{ fontSize: 18, textAlign: "center", color: "white" }}>
            엄마들에게 도움이 되고 싶어요.
          </Text>
        </View>

        <View style={{ flex: 2, padding: 20 }}>
          <Google />

          <View style={{ height: 20 }} />
          <Ios />

          <View style={{ height: 20 }} />
          <Kakao />
        </View>
      </View>
    </View>
  );
}
