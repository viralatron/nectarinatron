import { useFrame } from "@react-three/fiber";
import { useState } from "react";

const MainScene = ({ data }) => {
  const [arrData, setArr] = useState([]);
  useFrame(() => {
    setArr(data.current);
  });
  return (
    <group position={[0, 0, 0]}>
      {arrData.map((el, ind) => (
        <mesh
          key={ind}
          position={[ind - arrData.length / 2 + 0.5, 0, 0]}
          scale={[0.2, el * 24, 0.2]}
        >
          <boxGeometry />
          <meshStandardMaterial color={`cyan`} roughness={0.3} metalness={1} />
        </mesh>
      ))}
    </group>
  );
};

export default MainScene;
