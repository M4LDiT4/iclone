import React, { useState, forwardRef, useImperativeHandle } from "react";
import {
  TextInput,
  TouchableOpacity,
  Text,
  Modal,
  FlatList,
  StyleSheet,
  Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  getCountries,
  getCountryCallingCode,
  parsePhoneNumberFromString,
  AsYouType,
} from "libphonenumber-js";
import metadata from 'libphonenumber-js/metadata.full.json';

type PhoneInputHandle = {
  getFullNumber: () => string;
  isValid: () => boolean;
};

type PhoneInputProps = {
  placeholder?: string;
};

const countries = getCountries().map((iso2) => ({
  iso2,
  dialCode: getCountryCallingCode(iso2),
}));

const PhoneInputInner = (
  { placeholder = "Phone Number" }: PhoneInputProps,
  ref: React.Ref<PhoneInputHandle>
) => {
  const [country, setCountry] = useState(countries.find((c) => c.iso2 === "US"));
  const [phone, setPhone] = useState("");
  const [showPicker, setShowPicker] = useState(false);

  const handleChange = (text: string) => {
    // Format the number as the user types
    const formatter = new AsYouType(country?.iso2); // Replace 'US' with your default country
    const formattedNumber = formatter.input(text);

    setPhone(formattedNumber);
  };

  useImperativeHandle(ref, () => ({
    getFullNumber: () => `+${country?.dialCode}${phone}`,
    isValid: () => {
      const number = parsePhoneNumberFromString(
        `+${country?.dialCode}${phone}`
      );
      return number?.isValid() ?? false;
    },
  }));

  return (
    <>
      {/* Input Container */}
      <LinearGradient
        colors={["rgba(237, 242, 251, 0.5)", "rgba(80, 171, 231, 0.5)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.container}
      >

        {/* Country Code Button */}
        <TouchableOpacity
          style={styles.countryButton}
          onPress={() => setShowPicker(true)}
        >
          <Text style={styles.countryText}>+{country?.dialCode}</Text>
        </TouchableOpacity>

        {/* Phone Field */}
        <TextInput
          placeholder={placeholder}
          value={phone}
          onChangeText={handleChange}
          keyboardType="phone-pad"
          style={styles.phoneInput}
        />
      </LinearGradient>

      {/* Country Code Picker */}
      <Modal visible={showPicker} animationType="slide" transparent>
        <Pressable
          style={styles.modalBackground}
          onPress={() => setShowPicker(false)}   // closes when tapping outside
        >
          {/* Prevent closing when tapping INSIDE the box */}
          <Pressable style={styles.modalBox}>
            <FlatList
              data={countries}
              keyExtractor={(item) => item.iso2}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.countryRow}
                  onPress={() => {
                    setCountry(item);
                    setShowPicker(false);
                  }}
                >
                  <Text style={styles.countryRowText}>
                    {item.iso2} (+{item.dialCode})
                  </Text>
                </TouchableOpacity>
              )}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
};

export default forwardRef(PhoneInputInner);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    height: 47,
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  countryButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 8,
  },
  countryText: {
    fontSize: 14,
    fontWeight: "600",
  },
  phoneInput: {
    flex: 1,
    fontSize: 14,
    padding: 0,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
  },
  modalBox: {
    backgroundColor: "white",
    marginHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 10,
    maxHeight: "70%",
  },
  countryRow: {
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  countryRowText: {
    fontSize: 16,
  },
});
