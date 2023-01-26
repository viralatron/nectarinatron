import { Hud, PerspectiveCamera, Text } from "@react-three/drei";
import { extend, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Suspense, useRef, useState } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Scene } from "three";

extend({ Scene });

const PlayButton = () => {
  const meshRef = useRef();

  useFrame(() => {
    meshRef.current.rotation.y += 0.01;
  });

  const gltf = useLoader(GLTFLoader, "/assets/play-button.glb");

  return (
    <Suspense fallback={null}>
      <primitive ref={meshRef} object={gltf.scene} scale={0.75} />
    </Suspense>
  );
};
const StopButton = () => {
  const meshRef = useRef();

  useFrame(() => {
    meshRef.current.rotation.y += 0.01;
  });

  const gltf = useLoader(GLTFLoader, "/assets/stop-button.glb");

  return (
    <Suspense fallback={null}>
      <primitive ref={meshRef} object={gltf.scene} scale={0.75} />
    </Suspense>
  );
};

const HUD = ({ start, stop }) => {
  const { size } = useThree();

  const [isVert, setVert] = useState(false);
  useFrame(() => {
    if (size.width < size.height) {
      setVert(true);
    } else {
      setVert(false);
    }

    // console.log(size);
  });
  return (
    <Hud renderPriority={1} position={[0, 0, 0]}>
      {/* <OrthographicCamera zoom={100} position={[0, 0, 0]} makeDefault /> */}

      <ambientLight intensity={0.1} />
      <directionalLight color="white" position={[0, 0, 5]} />

      <group
        position={[isVert ? -3.2 : -6, isVert ? -6 : -2.5, -1]}
        onClick={() => stop()}
      >
        <Text
          scale={[1, 1, 1]}
          color="black" // default
          anchorX="center" // default
          anchorY="middle" // default
        >
          STOP
        </Text>
        {/* <StopButton /> */}
      </group>
      <group
        position={[isVert ? 3.2 : 6, isVert ? -6 : -2.5, -1]}
        onClick={() => start()}
      >
        <Text
          scale={[1, 1, 1]}
          color="black" // default
          anchorX="center" // default
          anchorY="middle" // default
        >
          PLAY
        </Text>
        {/* <PlayButton /> */}
      </group>
    </Hud>
  );
};

export default HUD;
