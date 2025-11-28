import React, { useState } from "react";
import { Image, ImageSourcePropType, ImageStyle, StyleProp, View } from "react-native";

type SmartImageProps = {
  source: string | ImageSourcePropType;
  fallbackImage?: ImageSourcePropType;
  fallbackIcon?: React.ReactNode;   // <-- ANY icon component
  style?: StyleProp<ImageStyle>;
  resizeMode?: "cover" | "contain" | "stretch" | "repeat" | "center";
};

export default function SmartImage({
  source,
  fallbackImage,
  fallbackIcon,
  style,
  resizeMode = "cover",
}: SmartImageProps) {
  const [error, setError] = useState(false);

  const isRemoteString = (src: string) =>
    src.startsWith("http://") || src.startsWith("https://");

  const resolveSource = (): ImageSourcePropType | null => {
    if (error) {
      if (fallbackImage) return fallbackImage;
      return null; // we'll render fallbackIcon instead
    }

    if (typeof source !== "string") return source;
    if (isRemoteString(source)) return { uri: source };

    return null;
  };

  const resolved = resolveSource();

  // If we have an error AND the fallback is an icon, render the icon
  if (error && !resolved && fallbackIcon) {
    return <View style={style}>{fallbackIcon}</View>;
  }

  // Otherwise render the image
  return (
    <Image
      style={style}
      resizeMode={resizeMode}
      source={resolved ?? undefined}
      onError={() => setError(true)}
    />
  );
}
