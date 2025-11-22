export const getElevation = (level = 5) => ({
  elevation: level,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: level * 0.5 },
  shadowOpacity: 0.3,
  shadowRadius: level * 0.8,
});