import { Effects } from "@react-three/drei";
import { extend, useThree } from "@react-three/fiber";
import { Vector2 } from "three";
import { RenderPixelatedPass } from "./RenderPixelatedPass";

extend({ RenderPixelatedPass });

const PixelPass = () => {
  const { scene, camera, size } = useThree();
  const screenResolution = new Vector2(size.width, size.height);

  return (
    <Effects>
      <renderPixelatedPass
        args={[screenResolution, 2, scene, camera, {}]}
        attachArray="passes"
      />
    </Effects>
  );
};

export default PixelPass;
