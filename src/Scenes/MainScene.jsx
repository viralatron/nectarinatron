import { extend } from "@react-three/fiber";
import { Scene } from "three";

extend({ Scene });

const MainScene = ({ data }) => {
  return (
    <group position={[0, 0, 10]}>
      {data.current.map((el, ind) => (
        <mesh key={ind} position={[0, 0, 0]} scale={[10, 10, 10]}>
          <boxGeometry />
          <meshStandardMaterial color={`cyan`} roughness={0.3} metalness={1} />
        </mesh>
      ))}
    </group>
  );
};

export default MainScene;
