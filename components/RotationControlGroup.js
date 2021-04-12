import { StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-elements";
import React from "react";

export default function RotationControlGroup({
  groupName,
  increaseFunc,
  decreaseFunc,
  increaseLabel = null,
  decreaseLabel = null,
}) {
  return (
    <View style={styles.actionGroupStyle}>
      <Text style={{ fontSize: 20 }}>{groupName}</Text>
      <Button
        buttonStyle={styles.actionButtonStyle}
        title={decreaseLabel ? decreaseLabel : "-"}
        onPress={decreaseFunc}
      />
      <Button
        buttonStyle={styles.actionButtonStyle}
        title={increaseLabel ? increaseLabel : "+"}
        onPress={increaseFunc}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  actionGroupStyle: {
    fontSize: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  actionButtonStyle: {
    backgroundColor: "orange",
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginHorizontal: 10,
    marginVertical: 3,
  },
});
