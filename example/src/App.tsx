import * as React from 'react';

import { StyleSheet, View, Platform } from 'react-native';
import { GooglePayExample } from './components';

export default function App() {
  return (
    <View style={styles.container}>
      {Platform.OS === 'android' ? <GooglePayExample /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
