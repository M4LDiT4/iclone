import React from "react";
import {
  AntDesign,
  Entypo,
  EvilIcons,
  Feather,
  FontAwesome,
  FontAwesome5,
  Foundation,
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
  Octicons,
  SimpleLineIcons,
  Zocial,
} from "@expo/vector-icons";
import AppColors from "@/core/styling/AppColors";

const iconLibraries: Record<string, any> = {
  AntDesign,
  Entypo,
  EvilIcons,
  Feather,
  FontAwesome,
  FontAwesome5,
  Foundation,
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
  Octicons,
  SimpleLineIcons,
  Zocial,
};

type IconRendererProps = {
  library: string;
  name: string;
  size?: number;
  color?: string;
};

const IconRenderer: React.FC<IconRendererProps> = ({
  library,
  name,
  size = 24,
  color = AppColors.primaryColor,
}) => {
  try {
    const IconSet = iconLibraries[library];
    if (IconSet && typeof IconSet === "function") {
      return <IconSet name={name} size={size} color={color} />;
    }
    throw new Error("Invalid library or icon name");
  } catch (error) {
    // Fallback: return a default icon if lookup fails
    return <AntDesign name="question-circle" size={size} color={color} />;
  }
};

export default IconRenderer;