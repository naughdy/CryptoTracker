import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, StatusBar, BackHandler } from 'react-native';
import Home from './screens/Home'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

function App() {
  return (

    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      <Stack.Navigator headerMode="none"
      >
          <Stack.Screen name="Home" component={Home} />
      </Stack.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default () => {
  return (
    <NavigationContainer>
      <App></App>
    </NavigationContainer>


  )
}