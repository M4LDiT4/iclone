import { Text, View, StyleSheet } from 'react-native';
import AppColors from '@/core/styling/AppColors';
import Logo from '../assets/svg/llm_logo.svg';

export default function Index() {
  return (
    <View style={styles.container}>
      <View style = {styles.upperContainer} >
        <Text style={styles.primaryText}>
          Hello, Elena
        </Text>
        <Text style = {styles.welcomeText}>
          Welcome back!
        </Text>
        <View style ={styles.svgContainer}>
          <Logo>
          </Logo>
        </View>
      </View>
      <View style = {styles.lowerContainer}>
        <Text
          style = {styles.primaryText}
        >
          Do you have stories for me?
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.backgroundColor,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20
  },
  button: {
    fontSize: 20,
    textDecorationLine: 'underline',
    color: '#fff',
  },
  primaryText : {
    fontFamily: 'SFProText',
    fontWeight: 'bold',
    fontSize: 30,
    color: AppColors.primaryColor,
    padding: 0,
    margin: 0,
    lineHeight: 32,
    letterSpacing: -1,
    textAlign: 'center',
  },
  welcomeText : {
    fontFamily: 'SFProText',
    fontWeight: 'bold',
    fontSize: 16,
    color: AppColors.secondaryColor,
    lineHeight: 18
  },
  svgContainer : {
    paddingVertical: 32,
  },
  upperContainer: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lowerContainer:{
    flex: 2
  }
});
