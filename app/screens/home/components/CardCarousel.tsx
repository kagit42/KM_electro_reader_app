import React from 'react';
import { Image, View } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { SizeConfig } from '../../../assets/size/size';

const CardCarousel = () => {
  const CAROUSEL_DATA = [
    require('../../../assets/images/home/banner1.jpg'),
    require('../../../assets/images/home/banner2.jpeg'),
    require('../../../assets/images/home/banner3.jpg'),
  ];

  return (
    <Carousel
      loop
      autoPlay
      autoPlayInterval={4000}
      width={SizeConfig.width * 93}
      height={SizeConfig.height * 14}
      data={CAROUSEL_DATA}
      scrollAnimationDuration={1000}
      onConfigurePanGesture={g => {
        g.activeOffsetX([-10, 10]);
        g.failOffsetY([-10, 10]);
      }}
      renderItem={({ item }) => (
        <View
          style={{
            width: '99%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal : SizeConfig.width * 0.5
          }}
        >
          <Image
            source={item}
            resizeMode="stretch"
            style={{
              width: '100%',
              height: '100%',
              borderRadius: SizeConfig.width * 3,
              // backgroundColor : 'red'
            }}
          />
        </View>
      )}
    />
  );
};

export default CardCarousel;
