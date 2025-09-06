
export const ProfileEmpDetailCard = ({
  icon,
  value,
}: {
  icon: ReactNode;
  value: string;
}) => {
  return (
    <View
      style={{
        flexDirection: 'column',
        borderColor: '#FFFFFF',
        borderWidth: SizeConfig.width * 0.2,
        borderRadius: SizeConfig.width * 3,
        width: SizeConfig.width * 25,
        height: SizeConfig.height * 10,
        justifyContent: 'center',
        alignItems: 'center',
        gap: SizeConfig.height * 1,
        padding: SizeConfig.width * 2,
        backgroundColor: theme.COLORS.primary,
        elevation: 6,
        shadowColor: theme.COLORS.color_FFFF,
        shadowOpacity: 0.2,
        shadowOffset: {width: 0, height: 1},
        shadowRadius: 2,
      }}>
      {icon}

      <AppText style={styles.ProfileEmployeeDetailsValue}>{value}</AppText>
    </View>
  );
};
