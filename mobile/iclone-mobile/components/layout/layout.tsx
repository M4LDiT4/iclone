import React from "react";
import { View, ViewStyle, StyleProp } from "react-native";

type RNStyle = StyleProp<ViewStyle>;

export const Row = ({
  children,
  style,
  align = "center",
  justify = "flex-start",
}: {
  children: React.ReactNode;
  style?: RNStyle;
  align?: ViewStyle["alignItems"];
  justify?: ViewStyle["justifyContent"];
}) => (
  <View
    style={[
      {
        flexDirection: "row",
        alignItems: align,
        justifyContent: justify,
      },
      style,
    ]}
  >
    {children}
  </View>
);

export const Column = ({
  children,
  style,
  align = "flex-start",
  justify = "flex-start",
}: {
  children: React.ReactNode;
  style?: RNStyle;
  align?: ViewStyle["alignItems"];
  justify?: ViewStyle["justifyContent"];
}) => (
  <View
    style={[
      {
        flexDirection: "column",
        alignItems: align,
        justifyContent: justify,
      },
      style,
    ]}
  >
    {children}
  </View>
);

export const Expanded = ({
  children,
  flex = 1,
  style,
}: {
  children: React.ReactNode;
  flex?: number;
  style?: RNStyle;
}) => (
  <View style={[{ flex, flexDirection: 'row' }, style]}>
    {children}
  </View>
);

export const Center = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: RNStyle;
}) => (
  <View
    style={[
      {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
      },
      style,
    ]}
  >
    {children}
  </View>
);

export const Spacer = ({
  size,
  width,
  height,
}: {
  size?: number;
  width?: number;
  height?: number;
}) => (
  <View
    style={{
      width: size ?? width ?? 0,
      height: size ?? height ?? 0,
    }}
  />
);

export const Padding = ({
  children,
  all,
  horizontal,
  vertical,
  top,
  bottom,
  left,
  right,
  style,
}: {
  children: React.ReactNode;
  all?: number;
  horizontal?: number;
  vertical?: number;
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
  style?: RNStyle;
}) => (
  <View
    style={[
      {
        padding: all,
        paddingHorizontal: horizontal,
        paddingVertical: vertical,
        paddingTop: top,
        paddingBottom: bottom,
        paddingLeft: left,
        paddingRight: right,
      },
      style,
    ]}
  >
    {children}
  </View>
);

export const Stack = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: RNStyle;
}) => (
  <View
    style={[
      {
        position: "relative",
      },
      style,
    ]}
  >
    {children}
  </View>
);


Stack.Item = ({
  children,
  top,
  bottom,
  left,
  right,
  style,
}: {
  children: React.ReactNode;
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
  style?: RNStyle;
}) => (
  <View
    style={[
      {
        position: "absolute",
        top,
        bottom,
        left,
        right,
      },
      style,
    ]}
  >
    {children}
  </View>
);


