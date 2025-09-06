import { Pressable, StyleSheet, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { SizeConfig } from '../assets/size/size';
import { colors, fonts } from '../utils/Theme';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Dispatch, ReactNode, SetStateAction } from 'react';

const CustomDropDown = ({
  Icon,
  data,
  value,
  setValue,
  placeholder = 'Select Outlet',
}: {
  Icon: ReactNode;
  data: any;
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  placeholder: string;
}) => {
  return (
    <View style={styles.dropdownWrapper}>
      <Pressable
        style={{
          backgroundColor: colors.white,
          paddingLeft: SizeConfig.width * 3,
          alignItems: 'center',
          justifyContent: 'center',
          position: 'absolute',
        }}
      >
        {Icon}
      </Pressable>
      <Dropdown
        style={styles.dropdown}
        data={data}
        maxHeight={SizeConfig.height * 30}
        labelField="label"
        valueField="value"
        placeholder={placeholder}
        value={value}
        onChange={item => setValue(item.value)}
        selectedTextStyle={styles.dropdownText}
        placeholderStyle={styles.dropdownPlaceholder}
        itemTextStyle={{
          fontFamily: fonts.medium,
          fontSize: SizeConfig.fontSize * 3.7,
          color: colors.color_4C5F66,
        }}
        showsVerticalScrollIndicator={false}
        containerStyle={{
          marginTop: SizeConfig.height * 2,
          borderRadius: SizeConfig.width * 3,
          elevation: 0,
          borderColor: colors.color_E7E3E0,
          borderWidth: 1,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: SizeConfig.width * 3,
  },
  dropdown: {
    flex: 1,
    // borderWidth: 1,
    // borderColor: colors.border,
    borderRadius: SizeConfig.width * 4,
    paddingHorizontal: SizeConfig.width * 3,
    paddingVertical: SizeConfig.height * 1.7,
  },
  dropdownText: {
    fontFamily: fonts.medium,
    fontSize: SizeConfig.fontSize * 3.7,
    color: colors.color_4C5F66,
    paddingLeft: SizeConfig.width * 8,
  },
  dropdownPlaceholder: {
    fontFamily: fonts.medium,
    fontSize: SizeConfig.fontSize * 3.7,
    color: colors.secondary,
    paddingLeft: SizeConfig.width * 8,
  },
});

export default CustomDropDown;
