import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import AppColors from '@/core/styling/AppColors';
import Logo from '../assets/svg/llm_logo.svg';
import Bolt from '../assets/svg/bolt.svg';
import Bulb from '../assets/svg/lightbulb-alt.svg';
import Heart from '../assets/svg/heart.svg';
import SampleImage from '../assets/svg/sample_image.svg';

import ChatBasicDetailsCard from '@/components/containers/chatBasicDetailsCard';
import Spacer from '@/components/spacers/spacer';
import ChatInputBar from '@/components/textinputs/chatInputBar';
import { SafeAreaView } from 'react-native-safe-area-context';
import ChipIcon from '@/components/chips/chipIcon';
import FrostedCard from '@/components/cards/frostedCard';
import { hexToRgba } from '@/core/utils/colorHelpers';


export default function Index() {
  return (
    <SafeAreaView edges={['left', 'right']} style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.wrapper}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={80}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.upperContainer}>
            <Text style={styles.primaryText}>Hello, Elena</Text>
            <Text style={styles.welcomeText}>Welcome back!</Text>
            <TouchableOpacity>
              <View style={styles.svgContainer}>
                <Logo />
                <View
                  style={styles.quickThoughtsContainer}
                >
                  <ChipIcon
                    icon={<Bolt/>}
                    label='Quick Thoughts'
                  />
                </View>
                <View
                  style={styles.lifeLessonContainer}
                >
                  <ChipIcon
                    icon={<Bulb/>}
                    label='Life Lesson'
                  />
                </View>
                <View
                  style={styles.familyContainer}
                >
                  <ChipIcon
                    icon={<Heart/>}
                    label='Family'
                  />
                </View>
                <View
                  style={styles.sampleImageContainer}
                >
                  <FrostedCard
                    tintColor={hexToRgba(AppColors.secondaryColor, 0.1)}
                  >
                    <SampleImage/>
                  </FrostedCard>
                </View>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.lowerContainer}>
            <Text style={styles.primaryText}>Do you have stories for me?</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.storiesContainer}
            >
              <ChatBasicDetailsCard
                iconName="heart-outline"
                iconColor={AppColors.primaryColor}
                label="Family Traditions and holidays"
              />
              <Spacer width={8} />
              <ChatBasicDetailsCard
                iconName="bulb-outline"
                iconColor={AppColors.primaryColor}
                label="Lessons from your career"
              />
              <Spacer width={8} />
              <ChatBasicDetailsCard
                iconName="time-outline"
                iconColor={AppColors.primaryColor}
                label="Your childhood home and memories"
              />
              <Spacer width={8} />
              <ChatBasicDetailsCard
                iconName="chatbubble-ellipses-outline"
                iconColor={AppColors.primaryColor}
                label="Advice for important life moments"
              />
              <Spacer width={8} />
              <TouchableOpacity style={styles.viewMoreButton}>
                <Text style={styles.viewMoreText}>View More</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </ScrollView>
        <ChatInputBar/>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AppColors.backgroundColor,
    paddingBottom: 16
  },
  wrapper: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  primaryText: {
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
  welcomeText: {
    fontFamily: 'SFProText',
    fontWeight: 'bold',
    fontSize: 16,
    color: AppColors.secondaryColor,
    lineHeight: 18,
  },
  svgContainer: {
    paddingVertical: 32,
    position: 'relative',
  },
  upperContainer: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lowerContainer: {
    flex: 2,
  },
  storiesContainer: {
    paddingTop: 16,
    flexDirection: 'row',
    alignItems: 'center'
  },
  viewMoreButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  viewMoreText: {
    color: AppColors.primaryColor,
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'SFProText',
  },
  quickThoughtsContainer: {
    position: 'absolute',
    left: -30,
    bottom: 160,
  },
  lifeLessonContainer : {
    position: 'absolute',
    right: -50,
    bottom: 130,
  },
  familyContainer : {
    position: 'absolute',
    left: 10,
    bottom: 80,
  },
  sampleImageContainer :  {
    position: 'absolute',
    right: -20,
    bottom: -1,
  },
});