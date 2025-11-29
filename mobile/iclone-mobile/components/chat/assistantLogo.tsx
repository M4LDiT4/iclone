import { View, StyleSheet, Text } from "react-native";
import { Padding, Stack } from "../layout/layout";
import Logo from '../../assets/svg/llm_logo.svg';
import { memo } from "react";
import GradientContainer from "../containers/gradientContainer";
import { hexToRgba } from "@/core/utils/colorHelpers";
import AppColors from "@/core/styling/AppColors";

export type AssistantLogoType = 'small' | 'large';

function AssistantLogo({type, isUserTyping, isSystemTyping}:{
  type: AssistantLogoType,
  isUserTyping: boolean,
  isSystemTyping: boolean
}){
  const isSmall = type == 'small';
  const size = isSmall ? 48 : 116;

  const displayText = () => {
    if(isUserTyping){
      return "Listening...";
    }else if(isSystemTyping){
      return "Typing...";
    }else {
      return "Hello. How can I help you";
    }
  }

  return <Stack.Item 
    style={[
      styles.stackItem, 
      {justifyContent: isSmall? 'flex-start' : 'center'},
      isSmall? styles.maintContainerBottom : styles.mainContainerTop
    ]}>
    <Stack style={[styles.childStack, isSmall? styles.childStackSmall: styles.childStackLarge ]}>
      <Logo width={size} height={size}/>
      <Stack.Item style={[isSmall ? styles.childBottom: styles.childTop]}>
        <GradientContainer borderRadius={10}>
          <Padding all={8}>
            <Text style = {styles.textContent} numberOfLines={1}>{displayText()}</Text>
          </Padding>
        </GradientContainer>
      </Stack.Item>
    </Stack>
  </Stack.Item>
}

export default memo(AssistantLogo);

const styles = StyleSheet.create({
  stackItem: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    overflow: 'visible',
  },
  mainContainerTop: {
    top: 0,       // pinned to top
  },
  maintContainerBottom: {
    bottom: 20,    // pinned to bottom
  },
  childStack:{
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
  },
  childStackSmall: {
    justifyContent: 'flex-start',
  },
  childStackLarge: {
    justifyContent: 'center'
  },
  childBottom: {
    bottom: -20,
    left: 20
  },
  childTop: {
    bottom: -20
  },
  textContent: {
    color: hexToRgba(AppColors.primaryColor, 0.7),
    fontSize: 12,
    lineHeight: 13,
    fontFamily: 'SFProText'
  }
})