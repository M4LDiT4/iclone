import React, { memo, useEffect, useState } from "react";
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
import { TagService } from "@/services/TagService"; // <-- your service for resolving icons

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

type TagIconProps = {
  tagId: string;              // ID of the tag in DB
  iconLibrary: string | null; // may be null initially
  iconName: string | null;    // may be null initially
  size?: number;
  color?: string;
};

function TagIcon({
  tagId,
  iconLibrary,
  iconName,
  size = 24,
  color = AppColors.primaryColor,
}: TagIconProps) {
  const [resolvedLibrary, setResolvedLibrary] = useState(iconLibrary);
  const [resolvedName, setResolvedName] = useState(iconName);

  useEffect(() => {
    const resolveIcon = async () => {
      if (!resolvedLibrary || !resolvedName) {
        try {
          // Ask TagService to generate + persist icon metadata
          const suggestion = await TagService.resolveIcon(tagId);

          setResolvedLibrary(suggestion.library);
          setResolvedName(suggestion.name);
        } catch (err) {
          console.error("Failed to resolve icon:", err);
        }
      }
    };

    resolveIcon();
  }, [tagId, resolvedLibrary, resolvedName]);

  try {
    if (!resolvedLibrary || !resolvedName) {
      throw new Error("Missing icon metadata");
    }

    const IconSet = iconLibraries[resolvedLibrary];
    if (IconSet && typeof IconSet === "function") {
      return <IconSet name={resolvedName} size={size} color={color} />;
    }

    throw new Error("Invalid library or icon name");
  } catch (err) {
    // Fallback icon
    return <AntDesign name="question-circle" size={size} color={color} />;
  }
}

export default memo(TagIcon);