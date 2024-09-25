import { StyleSheet, ScrollView, View } from 'react-native';

export default function Tuilerie({ children }) {
    return (
       
        <View style={styles.tuilerie}>
          {children}
        </View>
    
    );
  }

  const styles = StyleSheet.create({
    tuilerie: {
      flex: 1,
      flexDirection: "column",
    },
  });
  