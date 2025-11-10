import React from 'react'
import { View, StyleSheet, ViewStyle } from 'react-native'

type TintedContainerProps = {
  height?: number
  width?: number
  tintColor?: string
  opacity?: number
  children?: React.ReactNode
}

export default function GenericContainer({
  height = 100,
  width = 100,
  tintColor = '#3498db',
  opacity = 0.1,
  children,
}: TintedContainerProps){
  const containerStyle: ViewStyle = {
    height,
    width,
    backgroundColor: tintColor,
    opacity,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  }

  return (
    <View style = {containerStyle}>
      {children}
    </View>
  )
}