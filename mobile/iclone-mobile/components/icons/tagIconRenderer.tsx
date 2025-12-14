import React, { memo, useEffect, useState, useCallback } from "react";
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
  iconLibrary?: string | null;
  iconName?: string | null;
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

  /** 🔧 Extracted resolve logic */
  const resolveIcon = useCallback(
    async (prevLibrary?: string | null, prevName?: string | null) => {
      if (retryCount >= maxRetries) return;

      try {
        const suggestion = await tagService.generateAndSaveIconMetadata({
          tagId,
          tagName,
          tagIconLibrary: prevLibrary ?? iconLibrary ?? undefined,
          tagIconName: prevName ?? iconName ?? undefined,
        });

        setResolvedLibrary(suggestion.iconLibrary);
        setResolvedName(suggestion.iconName);
      } catch (err) {
        console.error(`Failed to resolve icon (attempt ${retryCount + 1}):`, err);
        setRetryCount((prev) => prev + 1);
      }
    },
    [tagId, tagName, iconLibrary, iconName, retryCount, tagService]
  );

  // Initial resolution attempt
  useEffect(() => {
    if ((!resolvedLibrary || !resolvedName) && retryCount < maxRetries) {
      resolveIcon(resolvedLibrary, resolvedName);
    }
  }, [resolvedLibrary, resolvedName, retryCount, resolveIcon]);

  /** ✅ Validation helper */
  const isValidIcon = (IconSet: any, name: string) => {
    return IconSet?.glyphMap && !!IconSet.glyphMap[name];
  };

  try {
    if (!resolvedLibrary || !resolvedName) {
      throw new Error("Missing icon metadata");
    }

    const IconSet = iconLibraries[resolvedLibrary];

    if (IconSet && typeof IconSet === "function") {
      if (isValidIcon(IconSet, resolvedName)) {
        return <IconSet name={resolvedName} size={size} color={color} />;
      } else {
        // 🚑 Self-healing: invalid name detected
        throw new Error(`Invalid icon name "${resolvedName}" for library "${resolvedLibrary}"`);
      }
    }

    throw new Error("Invalid library");
  } catch (err) {
    // Attempt to heal by retrying with the current invalid combo
    resolveIcon(resolvedLibrary, resolvedName);

    // Fallback icon while healing
    return <AntDesign name="question-circle" size={size} color={color} />;
  }
}

export default memo(TagIcon);