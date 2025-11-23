import React, {
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import { TextInput, ViewStyle, Text, StyleSheet} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { hexToRgba } from "@/core/utils/colorHelpers";
import { debounce } from "lodash";
import { Column } from "../layout/layout";

export type InputState = "idle" | "error";

export type GenericTextInputHandle = {
  validate: () => boolean;
  getValue: () => string;
};

type GenericTextInputProps = {
  containerStyle?: ViewStyle;
  validator?: (value: string) => string | null; // return null = valid, return string = error
  debounceMs?: number;
  defaultValue?: string; 
  placeholder?: string;
  placeholderTextColor?: string;
  isRequired? : boolean
};

const GenericTextInputInner = (
  {
    containerStyle,
    validator,
    debounceMs = 1000,
    defaultValue = "",
    placeholder = "Enter text",
    placeholderTextColor = hexToRgba("#023E65", 0.6),
    isRequired = false,
  }: GenericTextInputProps,
  ref: React.Ref<GenericTextInputHandle>
) => {
  const [value, setValue] = useState(defaultValue);
  const [state, setState] = useState<InputState>("idle");
  const [errMessage, setErrMessage] = useState<string | null>(null);

  const inputRef = useRef<TextInput>(null);

  const runValidation = (val: string) => {
    if (!validator) return true;

    const message = validator(val);

    setState(message ? "error" : "idle");
    setErrMessage(message);

    return message == null;
  };

  const debouncedValidation = useRef(
    debounce((val: string) => {
      runValidation(val)
    }, debounceMs)
  ).current;

  useImperativeHandle(ref, () => ({
    validate() {
      return runValidation(value);
    },
    getValue() {
      return value;
    },
  }));

  return (
    <Column style ={{width: '100%'}}>
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
          placeholder={`${placeholder}${isRequired ? "*" : ""}`}
          placeholderTextColor={placeholderTextColor}
          value={value}
          autoCapitalize='none'
          onChangeText={(txt) => {
            setValue(txt);
            debouncedValidation(txt);
          }}
          style={{
            height: 47,
            fontSize: 14,
            padding: 0,
          }}
        />
      </LinearGradient>
      {state === 'error' && <Text style = {styles.errorText}>{errMessage?? 'required'}</Text>}
    </Column>
  );
};

export default React.memo(forwardRef(GenericTextInputInner));

const styles = StyleSheet.create({
  errorText: {
    color: '#D32F2F',       // Strong red for visibility
    fontSize: 14,           // Slightly smaller than body text
    fontWeight: '600',      // Semi-bold for emphasis
    marginTop: 4,           // Space above the error message
    marginBottom: 8,        // Space below if stacked
    textAlign: 'left',      // Align with input fields
  },
});


