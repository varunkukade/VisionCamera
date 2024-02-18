import * as React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {styles} from './HomeScreen.styles';

export const HomeScreen = () => {
  let items = [
    {
      id: 1,
      title: 'QR code Scanner',
    },
  ];
  return (
    <View style={styles.container}>
      {items.map(eachItem => {
        return (
          <TouchableOpacity activeOpacity={0.5} style={styles.itemContainer}>
            <Text style={styles.itemText}>{eachItem.title}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
