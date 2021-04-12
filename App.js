import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { GLView } from "expo-gl";
import { Renderer, THREE } from "expo-three";
import ExpoTHREE from "expo-three";
import { TweenMax } from "gsap";

import {
  AmbientLight,
  Fog,
  GridHelper,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  PointLight,
  Scene,
  SphereGeometry,
  SpotLight,
} from "three";

import { rotationStep, moveStep } from "./AppConstants";
import RotationControlGroup from "./components/RotationControlGroup";

class SphereMesh extends Mesh {
  constructor() {
    const sphereGeom = new SphereGeometry(
      0,
      50,
      50,
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
  let object;

  let cameraInitialPositionX = 0;
  let cameraInitialPositionY = 2;
  let cameraInitialPositionZ = 5;

  const onGLContextCreate = async (gl) => {
    const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;
    const renderer = new Renderer({
      gl,
      width,
      height,
      clearColor: "#fff",
    });
    console.log("onGLContextCreate: ", width, height);

    const scene = new Scene();
    scene.fog = new Fog("#3A96C4", 1, 10000);
    scene.add(new GridHelper(15, 15));

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

    object = await ExpoTHREE.loadAsync(
      [require("./assets/teamugobj.obj")],
      null,
      (imageName) => resources[imageName]
    );

    scene.add(object);

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

  const moveDiff = ({ x, y, z }) => {
    TweenMax.to(camera.position, 2.2, {
      z: camera.position.z + z,
      x: camera.position.x + x,
      y: camera.position.y + y,
    });
  };
  const rotateObject = ({ rotX = 0, rotY = 0, rotZ = 0 }) => {
    TweenMax.to(object.rotation, 0.2, {
      x: object.rotation.x + (rotX * Math.PI) / 180,
      y: object.rotation.y + (rotY * Math.PI) / 180,
      z: object.rotation.z + (rotZ * Math.PI) / 180,
    });
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
        <RotationControlGroup
          groupName={"Move"}
          increaseFunc={() => moveDiff({ x: 0, y: 0, z: moveStep })}
          increaseLabel={"Further"}
          decreaseFunc={() => moveDiff({ x: 0, y: 0, z: -moveStep })}
          decreaseLabel={"Closer"}
        />

        <RotationControlGroup
          groupName={"Shift"}
          increaseFunc={() => moveDiff({ x: moveStep, y: 0, z: 0 })}
          increaseLabel={"Right"}
          decreaseFunc={() => moveDiff({ x: -moveStep, y: 0, z: 0 })}
          decreaseLabel={"Left"}
        />

        <View style={{ paddingLeft: 50 }}>
          <RotationControlGroup
            groupName={"Rotate X"}
            increaseFunc={() => rotateObject({ rotX: rotationStep })}
            decreaseFunc={() => rotateObject({ rotX: -rotationStep })}
          />
          <RotationControlGroup
            groupName={"Rotate Y"}
            increaseFunc={() => rotateObject({ rotY: rotationStep })}
            decreaseFunc={() => rotateObject({ rotY: -rotationStep })}
          />
          <RotationControlGroup
            groupName={"Rotate Z"}
            increaseFunc={() => rotateObject({ rotZ: rotationStep })}
            decreaseFunc={() => rotateObject({ rotZ: -rotationStep })}
          />
        </View>
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
