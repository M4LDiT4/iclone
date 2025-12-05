import { ViewStyle } from "react-native";

class GlobalStyles {
  static screenGradientTop: ViewStyle = {
    position: "absolute",
    top: -50,
    left: -50,
    right: -50,
    height: 200,
    borderRadius: 200,
    zIndex: -1,
  }

  static screenGradientBottom: ViewStyle =  {
    position: "absolute",
    bottom: -150,
    left: -50,
    right: -50,
    height: 200,
    borderRadius: 200,
    zIndex: -1,
  }
}

export default GlobalStyles;