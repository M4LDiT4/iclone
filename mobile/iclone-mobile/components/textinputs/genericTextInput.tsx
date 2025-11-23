import React, {
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import { TextInput, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { hexToRgba } from "@/core/utils/colorHelpers";
import { debounce } from "lodash";

export type InputState = "idle" | "error";

export type GenericTextInputHandle = {
  validate: () => boolean;
  getValue: () => string;
};

type GenericTextInputProps = {
  containerStyle?: ViewStyle;
  validator?: (value: string) => string | null; // return null = valid, return string = error
  debounceMs?: number;
  defaultValue?: string; // initializes controlled state
  placeholder?: string;
  placeholderTextColor?: string;
};

const GenericTextInputInner = (
  {
    containerStyle,
    validator,
    debounceMs = 1000,
    defaultValue = "",
    placeholder = "Enter text",
    placeholderTextColor = hexToRgba("#023E65", 0.6),
  }: GenericTextInputProps,
  ref: React.Ref<GenericTextInputHandle>
) => {
  const [value, setValue] = useState(defaultValue);
  const [state, setState] = useState<InputState>("idle");
  const [errMessage, setErrMessage] = useState<string | null>(null);

  const inputRef = useRef<TextInput>(null);

  const runValidation = () => {
    if (!validator) return true;

    const message = validator(value);

    setState(message ? "error" : "idle");
    setErrMessage(message);

    return message == null;
  };

  const debouncedValidation = useRef(
    debounce(runValidation, debounceMs)
  ).current;

  useImperativeHandle(ref, () => ({
    validate() {
      return runValidation();
    },
    getValue() {
      return value;
    },
  }));

  return (
    <LinearGradient
      colors={["rgba(237, 242, 251, 0.5)", "rgba(80, 171, 231, 0.5)"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[
        {
          paddingHorizontal: 8,
          width: "100%",
          borderRadius: 10,
          overflow: "hidden",
          borderWidth: state === "error" ? 1 : 0,
          borderColor: state === "error" ? "red" : "transparent",
        },
        containerStyle,
      ]}
    >
      <TextInput
        ref={inputRef}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        value={value}
        onChangeText={(txt) => {
          setValue(txt);
          debouncedValidation();
        }}
        style={{
          height: 47,
          fontSize: 14,
          padding: 0,
        }}
      />
    </LinearGradient>
  );
};

// Wrapping order *must* be memo(forwardRef)
export default React.memo(forwardRef(GenericTextInputInner));

