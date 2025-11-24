import React, { useState, forwardRef, useImperativeHandle, useCallback } from "react";
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
import { debounce } from "lodash";
import { hexToRgba } from "@/core/utils/colorHelpers";

// Helper to get flag emoji from country code
const getFlagEmoji = (countryCode: string) =>
  countryCode
    .toUpperCase()
    .replace(/./g, (char) =>
      String.fromCodePoint(127397 + char.charCodeAt(0))
    );

export type PhoneInputHandle = {
  getFullNumber: () => string;
  validate: () => boolean;
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
  const [country, setCountry] = useState(countries.find((c) => c.iso2 === "PH"));
  const [phone, setPhone] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isValidNumber, setIsValidNumber] = useState<boolean | null>(null); 

  // Filter countries by search text
  const filteredCountries = countries.filter(
    (c) =>
      c.iso2.toLowerCase().includes(searchText.toLowerCase()) ||
      c.dialCode.includes(searchText)
  );

  const validateNumber = (input: string) => {
    if (!input || input.trim() === "") {
      setIsValidNumber(false);
      return false;
    }

    const fullNumber = `+${country?.dialCode}${input}`;
    const number = parsePhoneNumberFromString(fullNumber);
    const isValid = number?.isValid() ?? false;

    setIsValidNumber(isValid);
    return isValid;
  };


  // Debounce validation function
  const debouncedValidate = useCallback(debounce(validateNumber, 500), [country]);

  const handleChange = (text: string) => {
    const formatter = new AsYouType(country?.iso2);
    const formattedNumber = formatter.input(text);
    setPhone(formattedNumber);


    debouncedValidate(formattedNumber);
  };

  useImperativeHandle(ref, () => ({
    getFullNumber: () => `+${country?.dialCode}${phone}`,
    validate: () => validateNumber(phone) ?? false
  }));

  return (
    <>
      {/* Input Container */}
      <LinearGradient
        colors={["rgba(237, 242, 251, 0.5)", "rgba(80, 171, 231, 0.5)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          ...styles.container,
          borderWidth: isValidNumber !== null && !isValidNumber ? 1 : 0,
          borderColor: isValidNumber !== null && !isValidNumber ? "red" : "transparent",
        }}
      >
        <TouchableOpacity
          style={styles.countryButton}
          onPress={() => setShowPicker(true)}
        >
          <Text style={styles.countryText}>
            {getFlagEmoji(country?.iso2 || "US")} +{country?.dialCode}
          </Text>
        </TouchableOpacity>

        <TextInput
          placeholder={placeholder}
          value={phone}
          placeholderTextColor={hexToRgba("#023E65", 0.6)}
          onChangeText={handleChange}
          keyboardType="phone-pad"
          style={styles.phoneInput}
        />
      </LinearGradient>

      {isValidNumber !== null && (
        <Text style={isValidNumber ? styles.successText : styles.errorText}>
          {isValidNumber ? "Valid phone number" : "Invalid phone number"}
        </Text>
      )}

      {/* Country Picker Modal */}
      <Modal visible={showPicker} animationType="slide" transparent>
        <Pressable
          style={styles.modalBackground}
          onPress={() => setShowPicker(false)}
        >
          <Pressable style={styles.modalBox}>
            {/* Search Input */}
            <TextInput
              placeholder="Search country or code"
              value={searchText}
              onChangeText={setSearchText}
              style={styles.searchInput}
            />

            <FlatList
              data={filteredCountries}
              keyExtractor={(item) => item.iso2}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.countryRow}
                  onPress={() => {
                    setCountry(item);
                    setShowPicker(false);
                    setSearchText(""); // reset search
                  }}
                >
                  <Text style={styles.countryRowText}>
                    {getFlagEmoji(item.iso2)} {item.iso2} (+{item.dialCode})
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
    overflow: 'hidden',
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
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginHorizontal: 16,
    marginBottom: 10,
  },
  countryRow: {
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  countryRowText: {
    fontSize: 16,
  },
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
