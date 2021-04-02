import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View, TouchableWithoutFeedback } from "react-native";
import { GLView } from "expo-gl";
import { Renderer } from "expo-three";

import {
  AmbientLight,
  SphereGeometry,
  Fog,
  GridHelper,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  PointLight,
  Scene,
  SpotLight,
} from "three";

class SphereMesh extends Mesh {
  constructor() {
    const sphereGeom = new SphereGeometry(
      0,
      50,
      20,
      0,
      Math.PI * 2,
      0,
      Math.PI * 2
    );
    const meshMaterial = new MeshStandardMaterial({ color: 0xff0000 });
    super(sphereGeom, meshMaterial);
  }
}

export default function App() {
  const sphere = new SphereMesh();
  const camera = new PerspectiveCamera(100, 0.4, 0.01, 1000);

  let cameraInitialPositionX = 0;
  let cameraInitialPositionY = 2;
  let cameraInitialPositionZ = 5;

  const onGLContextCreate = async (gl) => {
    const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;

    const renderer = new Renderer({ gl });
    renderer.setSize(width, height);
    renderer.setClearColor("#fff");

    const scene = new Scene();
    scene.fog = new Fog("#3A96C4", 1, 10000);
    scene.add(new GridHelper(10, 10));

    const ambientLight = new AmbientLight(0x101010);
    scene.add(ambientLight);

    const pointLight = new PointLight(0xffffff, 2, 1000, 1);
    pointLight.position.set(0, 200, 200);
    scene.add(pointLight);

    const spotLight = new SpotLight(0xffffff, 0.5);
    spotLight.position.set(500, 100);
    spotLight.lookAt(scene.position);
    scene.add(spotLight);

    scene.add(sphere);

    camera.position.set(
      cameraInitialPositionX,
      cameraInitialPositionY,
      cameraInitialPositionZ
    );

    camera.lookAt(sphere.position);

    const renderGL = () => {
      requestAnimationFrame(renderGL);
      renderer.render(scene, camera);
      gl.endFrameEXP();
    };

    renderGL();
  };
  return (
    <View style={styles.container}>
      <Text>Proof of Concept for RN with Three.js</Text>
      <StatusBar style="auto" />
      <GLView
        style={{ flex: 1 }}
        onContextCreate={async (gl) => onGLContextCreate(gl)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
