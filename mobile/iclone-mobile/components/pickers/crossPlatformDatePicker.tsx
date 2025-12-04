import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Platform, View, Text, TouchableOpacity, Modal } from "react-native";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";

export interface DatePickerHandle {
  getValue: () => Date | null;
  setValue: (d: Date) => void;
  validate: () => boolean;
}

interface Props {
  title?: string;              // Label for the button
  buttonStyle?: object;        // Custom style for TouchableOpacity
  textStyle?: object;    
  isFlex?: boolean      // Custom style for displayed value
}

const CrossPlatformDatePicker = forwardRef<DatePickerHandle, Props>(
  ({ title = "Select Date", buttonStyle, textStyle, isFlex }, ref) => {
    const [date, setDate] = useState<Date | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [showPicker, setShowPicker] = useState(false);

    useImperativeHandle(ref, () => ({
      getValue: () => date,
      setValue: (d: Date) => setDate(d),
      validate: () => {
        if (!date) {
          setError("Please select a date");
          return false;
        }
        setError(null);
        return true;
      },
    }));

    const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
      if(event.type === 'dismissed') return;
      setShowPicker(Platform.OS === "ios"); 
      if (selectedDate) {
        setDate(selectedDate);
        setError(null);
      }
    };

    return (
      <View style={isFlex &&{flex: 1}}>
        {/* Stylable button */}
        <TouchableOpacity
          style={[
            {
              padding: 12,
              borderRadius: 8,
              backgroundColor: "rgba(80,171,231,0.5)",
              alignItems: "center",
            },
            buttonStyle,
          ]}
          onPress={() => setShowPicker(true)}
        >
          <Text style={[{ color: "white", fontWeight: "bold" }, textStyle]}>
            {date ? date.toLocaleDateString() : title}
          </Text>
        </TouchableOpacity>

        {/* Error message */}
        {error && <Text style={{ color: "red", marginTop: 4 }}>{error}</Text>}

        {/* Native picker */}
        {showPicker && (
          Platform.OS === "ios" ? (
            // Inline iOS picker
            <DateTimePicker
              value={date ?? new Date()}
              mode="date"
              display="spinner"
              onChange={onChange}
            />
          ) : (
            // Android uses modal dialog automatically
            <DateTimePicker
              value={date ?? new Date()}
              mode="date"
              display="default"
              onChange={onChange}
            />
          )
        )}
      </View>
    );
  }
);

export default CrossPlatformDatePicker;