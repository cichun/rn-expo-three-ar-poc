import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  Button,
} from "react-native";
import { GLView } from "expo-gl";
import { Renderer, THREE } from "expo-three";
import ExpoTHREE from "expo-three";
import { TweenMax } from "gsap";
import { Asset } from "expo-asset";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";

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

    // obj
    // const asset = new Asset.fromModule(require("./assets/teamugobj.obj"));
    // await asset.downloadAsync();
    // const loader = new OBJLoader();
    // const object = await new Promise((res, rej) =>
    //   loader.load(asset.localUri, res, () => {}, rej)
    // );
    // console.log("model loaded", object);
    // object.position.set(1, 0, 0);

    object = await ExpoTHREE.loadAsync(
      [require("./assets/teamugobj.obj")],
      // [require("./assets/Nesta_OBJ.obj")],
      null,
      (imageName) => resources[imageName]
    );

    // object.position.set(234.2966, 252.9658, -1480.171);

    // const object = await ExpoTHREE.loadAsync(
    //   [require("./assets/teamugobj.obj"), require("./assets/Nesta_OBJ.obj")],
    //   null,
    //   (imageName) => resources[imageName]
    // );

    // object.computeVertexNormals();
    // var material = new THREE.MeshStandardMaterial({
    //   color: 0x0055ff,
    //   flatShading: true,
    // });
    // var objectMesh = new THREE.Mesh(object, material);
    scene.add(object);

    camera.position.set(
      cameraInitialPositionX,
      cameraInitialPositionY,
      cameraInitialPositionZ
    );

    camera.lookAt(sphere.position);

    const renderGL = () => {
      // console.log("renderGL");
      requestAnimationFrame(renderGL);
      renderer.render(scene, camera);
      gl.endFrameEXP();
    };

    renderGL();
  };

  const move = (distance) => {
    // TweenMax.to(sphere.position, 0.2, { z: sphere.position.z + distance });
    TweenMax.to(camera.position, 0.2, { z: camera.position.z + distance });
  };

  const moveDiff = ({ x, y, z }) => {
    // TweenMax.to(sphere.position, 0.2, { z: sphere.position.z + distance });
    TweenMax.to(camera.position, 2.2, {
      z: camera.position.z + z,
      x: camera.position.x + x,
      y: camera.position.y + y,
    });
  };
  const rotateObject = ({ rotX = 0, rotY = 0, rotZ = 0 }) => {
    TweenMax.to(object.rotation, 0.2, {
      x: object.rotation.x + rotX,
      y: object.rotation.y + rotY,
      z: object.rotation.z + rotZ,
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
        <TouchableWithoutFeedback onPressIn={() => move(-20)}>
          <Text style={styles.buttonText}>UP</Text>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPressIn={() => move(20)}>
          <Text style={styles.buttonText}>Down</Text>
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback
          onPressIn={() => moveDiff({ x: -20, y: 0, z: 0 })}
        >
          <Text style={styles.buttonText}>Left</Text>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          onPressIn={() => moveDiff({ x: +20, y: 0, z: 0 })}
        >
          <Text style={styles.buttonText}>Right</Text>
        </TouchableWithoutFeedback>
        <Button
          title={"Rotate X"}
          onPress={() => rotateObject({ rotX: 0.1 })}
        />
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
