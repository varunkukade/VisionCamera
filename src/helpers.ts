export const getShadowProps = (
  offset: number = 2,
  radius: number = 8,
  opacity: number = 0.2,
) => ({
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: offset,
  },
  shadowOpacity: opacity,
  shadowRadius: radius,
  elevation: radius,
});
