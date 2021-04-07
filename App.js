import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View, TouchableWithoutFeedback } from "react-native";
import { GLView } from "expo-gl";
import { Renderer } from "expo-three";
import { TweenMax } from "gsap";

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
    console.log("onGLContextCreate: ", width, height);
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
      console.log("renderGL");
      requestAnimationFrame(renderGL);
      renderer.render(scene, camera);
      gl.endFrameEXP();
    };

    renderGL();
  };

  const move = (distance) => {
    TweenMax.to(sphere.position, 0.2, { z: sphere.position.z + distance });
    TweenMax.to(camera.position.z, 0.2, { z: camera.position.z + distance });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>
        Proof of Concept for RN with Three.js
      </Text>
      <StatusBar style="auto" />
      <GLView
        style={{ flex: 1, backgroundColor: "rgba(255,0,0,0.3)" }}
        onContextCreate={async (gl) => onGLContextCreate(gl)}
      />
      <View>
        <TouchableWithoutFeedback onPressIn={() => move(-0.2)}>
          <Text style={styles.buttonText}>UP</Text>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPressIn={() => move(0.2)}>
          <Text style={styles.buttonText}>Down</Text>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  headerText: {
    fontSize: 20,
    textAlign: "center",
  },
  buttonText: {
    fontSize: 36,
  },
});
