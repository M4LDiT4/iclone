import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Platform, Text, TouchableOpacity, StyleSheet } from "react-native";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { LinearGradient } from "expo-linear-gradient";
import { Column } from "../layout/layout"; // same layout wrapper you used
import { formatUSDate,} from "@/core/utils/formatter";

export interface DatePickerHandle {
  getValue: () => Date | null;
  setValue: (d: Date) => void;
  validate: () => boolean;
}

interface Props {
  title?: string;              // Label for the button
  buttonStyle?: object;        // Custom style for TouchableOpacity
  textStyle?: object;    
  isFlex?: boolean;            // Allow flex layout
  validator?: (value: Date | null) => string | null;
  successMessage?: string;
}

const CrossPlatformDatePicker = forwardRef<DatePickerHandle, Props>(
  ({ 
    title = "Select Date", 
    buttonStyle, 
    textStyle, 
    isFlex, 
    validator, 
    successMessage 
  }, ref) => {
    const [date, setDate] = useState<Date | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [showPicker, setShowPicker] = useState(false);
    const [state, setState] = useState<"idle" | "error" | "success">("idle");

    useImperativeHandle(ref, () => ({
      getValue: () => date,
      setValue: (d: Date) => setDate(d),
      validate: () => {
        if (!validator) {
          setState("success");
          return true;
        }
        const message = validator(date);
        if (message) {
          setError(message);
          setState("error");
        } else {
          setError(null);
          setState(successMessage ? "success" : "idle");
        }
        return message === null;
      },
    }));

    const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
      setShowPicker(Platform.OS === "ios");
      if (event.type === "dismissed") return;
      if (selectedDate) {
        setDate(selectedDate);
        setError(null);
        setState(successMessage ? "success" : "idle");
      }
    };

    return (
      <Column style={{ width: "100%" }}>
        <TouchableOpacity
          style={[
            {
              width: "100%",
              borderRadius: 10,
              overflow: "hidden",
              borderWidth: state === "error" ? 1 : 0,
              borderColor: state === "error" ? "red" : "transparent",
              minHeight: 47,
            },
            isFlex && { flex: 1 },
            buttonStyle,
          ]}
          onPress={() => setShowPicker(true)}
        >
          <LinearGradient
            colors={["rgba(237, 242, 251, 0.5)", "rgba(80, 171, 231, 0.5)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
              padding: 12,
              flex: 1,
            }}
          >
            <Text style={[{ fontSize: 14, color: "#023E65" }, textStyle]}>
              {date ? formatUSDate(date) : title}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {state === "error" && (
          <Text style={styles.errorText}>{error ?? "Required"}</Text>
        )}

        {state === "success" && successMessage && (
          <Text style={styles.successText}>{successMessage}</Text>
        )}

        {showPicker && (
          Platform.OS === "ios" ? (
            <DateTimePicker
              value={date ?? new Date()}
              mode="date"
              display="spinner"
              onChange={onChange}
            />
          ) : (
            <DateTimePicker
              value={date ?? new Date()}
              mode="date"
              display="default"
              onChange={onChange}
            />
          )
        )}
      </Column>
    );
  }
);

export default React.memo(CrossPlatformDatePicker);

const styles = StyleSheet.create({
  errorText: {
    color: "#D32F2F",
    fontSize: 14,
    marginTop: 4,
    marginBottom: 8,
    textAlign: "left",
  },
  successText: {
    color: "#388E3C",
    fontSize: 14,
    marginTop: 4,
    marginBottom: 8,
    textAlign: "left",
  },
});