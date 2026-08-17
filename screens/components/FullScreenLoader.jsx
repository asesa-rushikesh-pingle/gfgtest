import React from 'react';
import { StyleSheet, View, Modal, ActivityIndicator } from 'react-native';

const FullScreenLoader = ({ visible }) => {
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      statusBarTranslucent={true} // Extends loader under the Android status bar
    >
      <View style={styles.container}>
        {/* 'large' matches the standard core Android system spinner size */}
        <ActivityIndicator size="large" color="#FFA500" /> 
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Dimmed overlay background
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FullScreenLoader;