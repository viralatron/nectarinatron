import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useState } from "react";

const MainScene = ({ data }) => {
  const [arrData, setArr] = useState([]);
  useFrame(() => {
    setArr(data.current);
  });
  return (
    <group position={[4, 0, 0]}>
      <directionalLight
        castShadow
        intensity={4}
        position={100}
        shadow-camera-left={-100}
        shadow-camera-right={100}
        shadow-camera-top={100}
        shadow-camera-bottom={-100}
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        shadow-bias={false}
      />
      <ambientLight />
      <group position={[-4, 0.01, 0]} scale={2}>
        {arrData.map((el, ind) => (
          <mesh
            key={ind}
            position={[
              ind - arrData.length / 2 + 0.5,
              Math.abs((el * 24) / 2),
              0,
            ]}
            scale={[0.5, Math.abs(el * 24), 0.5]}
            castShadow
            receiveShadow
          >
            <boxGeometry />
            <meshStandardMaterial
              color={`cyan`}
              roughness={0.9}
              metalness={1}
            />
          </mesh>
        ))}
      </group>

      <GLTFScene />
    </group>
  );
};

const GLTFScene = () => {
  const gltf = useGLTF("/assets/main-scene.glb");

  gltf.scene.traverse(function (node) {
    if (node.isMesh) {
      if (node.name !== "ground") node.castShadow = true;
      node.receiveShadow = true;
    }
  });
  return <primitive object={gltf.scene} scale={3} position={0} />;
};

export default MainScene;
