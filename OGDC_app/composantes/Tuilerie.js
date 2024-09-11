import { StyleSheet, ScrollView, View } from 'react-native';

export default function Tuilerie({ children }) {
    return (
      <ScrollView>
        <View style={styles.tuilerie}>
          {children}
        </View>
      </ScrollView>
    );
  }

  const styles = StyleSheet.create({
    tuilerie: {
      flex: 0,
      flexDirection: "row",
      justifyContent: "center",
      flexWrap: "wrap",
    },
  });
  