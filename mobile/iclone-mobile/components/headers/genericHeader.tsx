import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import AppColors from "@/core/styling/AppColors";
import { Feather, SimpleLineIcons } from "@expo/vector-icons";
import { router } from "expo-router";

type HeaderProps = {
  label: string;
};

export default function GenericHeader({ label }: HeaderProps) {
  const insets = useSafeAreaInsets();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <View style={{ ...styles.container, height: 70 + insets.top, paddingTop: insets.top }}>
      <View style={styles.contentContainer}>
        <TouchableOpacity onPress={handleGoBack}>
          <Feather name="arrow-left-circle" size={36} color={AppColors.secondaryColor} />
        </TouchableOpacity>
        <Text style={styles.labelText}>{label}</Text>
        <SimpleLineIcons name="options" size={36} color={AppColors.secondaryColor} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: AppColors.primaryColor,
    alignItems: "center",
  },
  contentContainer: {
    flex: 1,
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: AppColors.backgroundColor,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  labelText: {
    fontFamily: "SFProText",
    fontWeight: "bold",
    fontSize: 31,
    lineHeight: 31,
    color: AppColors.primaryColor,
  },
});