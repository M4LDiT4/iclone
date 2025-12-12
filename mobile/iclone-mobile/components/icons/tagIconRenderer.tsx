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
import TagService from "@/services/TagService";

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
  tagId: string;
  tagName: string;
  tagService: TagService;
  iconLibrary: string | null;
  iconName: string | null;
  size?: number;
  color?: string;
};

function TagIcon({
  tagId,
  tagName,
  iconLibrary,
  tagService,
  iconName,
  size = 24,
  color = AppColors.primaryColor,
}: TagIconProps) {
  const [resolvedLibrary, setResolvedLibrary] = useState(iconLibrary);
  const [resolvedName, setResolvedName] = useState(iconName);
  const [retryCount, setRetryCount] = useState(0);

  const maxRetries = 3;

  useEffect(() => {
    const resolveIcon = async () => {
      if ((!resolvedLibrary || !resolvedName) && retryCount < maxRetries) {
        try {
          const suggestion = await tagService.generateAndSaveIconMetadata({
            tagId,
            tagName,
            tagIconLibrary: iconLibrary ?? undefined,
            tagIconName: iconName ?? undefined,
          });

          setResolvedLibrary(suggestion.iconLibrary);
          setResolvedName(suggestion.iconName);
        } catch (err) {
          console.error("Failed to resolve icon:", err);
          setRetryCount((prev) => prev + 1);
        }
      }
    };

    resolveIcon();
    // Only depend on tagId and retryCount to avoid infinite loops
  }, [tagId, retryCount]);

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
    // Fallback icon after max retries
    return <AntDesign name="question-circle" size={size} color={color} />;
  }
}

export default memo(TagIcon);