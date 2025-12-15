import { View, Text, StyleSheet } from 'react-native';
import AvatarContainer from '../images/avatarContainer';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppColors from '@/core/styling/AppColors';
import { useAuth } from '@/core/contexts/authContext';


export default function HomeHeader() {
  const insets = useSafeAreaInsets();
  const auth = useAuth();
  return (
    <View style={{...styles.container, height: 70 +insets.top, paddingTop: insets.top}}>
      <View style = {styles.contentContainer}>
        <AvatarContainer
          size={64}
          source={auth?.user?.photoURL}
          fallbackIcon = {<Ionicons name="person-circle" size={40} color="#aaa" />}
        />
        <Ionicons name='notifications-outline' size={36} color={AppColors.primaryColor}/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: AppColors.primaryColor,
    alignItems: 'center',
  },
  contentContainer: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: AppColors.backgroundColor,
    paddingVertical: 16,
    paddingHorizontal: 20,
  }
});