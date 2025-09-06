import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import Modal from 'react-native-modal';
import { colors, fonts } from '../../../utils/Theme';
import { SizeConfig } from '../../../assets/size/size';
import { useState } from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const CustomFromToDatePickerModal = ({
  isVisible,
  setVisible,
}: {
  isVisible: boolean;
  setVisible: (props: boolean) => void;
}) => {
  const today = new Date().toISOString().split('T')[0];
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [markedDates, setMarkedDates] = useState<any>({});

  console.log('startDate ', startDate);
  console.log('endDate ', endDate);
  console.log(new Date().toISOString());

  const handleDateSelect = (day: any): void => {
    const selectedDate = day.dateString;

    if (!startDate) {
      setStartDate(selectedDate);
      setEndDate(null);
      setMarkedDates({
        [selectedDate]: {
          startingDay: true,
          endingDay: true,
          color: colors.success,
          textColor: colors.white,
        },
      });
    } else if (startDate && !endDate) {
      if (new Date(selectedDate) < new Date(startDate)) {
        setStartDate(selectedDate);
        setEndDate(null);
        setMarkedDates({
          [selectedDate]: {
            startingDay: true,
            endingDay: true,
            color: colors.success,
            textColor: colors.white,
          },
        });
      } else {
        setEndDate(selectedDate);

        let range: any = {};
        let current = new Date(startDate);
        let last = new Date(selectedDate);

        while (current <= last) {
          const dateStr = current.toISOString().split('T')[0];
          range[dateStr] = {
            color: colors.success,
            textColor: colors.black,
          };
          current.setDate(current.getDate() + 1);
        }
        range[startDate] = {
          startingDay: true,
          color: colors.success,
          textColor: colors.white,
        };
        range[selectedDate] = {
          endingDay: true,
          color: colors.success,
          textColor: colors.white,
        };

        setMarkedDates(range);
      }
    } else {
      setStartDate(selectedDate);
      setEndDate(null);
      setMarkedDates({
        [selectedDate]: {
          startingDay: true,
          endingDay: true,
          color: colors.success,
          textColor: colors.white,
        },
      });
    }
  };

  return (
    <View>
      <Modal isVisible={isVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.calendarContainer}>
            <Calendar
              markingType={'period'}
              onDayPress={handleDateSelect}
              minDate={'2010-01-01'}
              maxDate={today}
              markedDates={markedDates}
              renderArrow={direction => (
                <MaterialIcons
                  name={direction === 'left' ? 'chevron-left' : 'chevron-right'}
                  size={SizeConfig.width * 5.7}
                  color={colors.black}
                />
              )}
            />

            <TouchableOpacity
              style={styles.confirmBtn}
              onPress={() => {
                setVisible(false);
              }}
            >
              <Text style={styles.closeButton}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarContainer: {
    backgroundColor: colors.white,
    borderRadius: SizeConfig.width * 3,
    padding: SizeConfig.width * 4,
  },
  closeButton: {
    textAlign: 'center',
    fontSize: SizeConfig.fontSize * 3.3,
    color: colors.black,
    fontFamily: fonts.semiBold,
  },
  confirmBtn: {
    backgroundColor: colors.primary,
    paddingVertical: SizeConfig.height,
    marginTop: SizeConfig.height * 2,
    borderRadius: SizeConfig.width * 3,
  },
});

export default CustomFromToDatePickerModal;
