import { PerspectiveCamera, Effects } from "@react-three/drei";
import {
  Canvas,
  render,
  extend,
  useFrame,
  useLoader,
  useThree,
} from "@react-three/fiber";
import React, { Suspense, useState } from "react";

import { useEffect, useRef } from "react";
import { Vector2 } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { RenderPixelatedPass } from "../postprocessing/RenderPixelatedPass.js";

extend({ RenderPixelatedPass });

const Player = ({ streams }) => {
  const audRef = useRef(null);
  const audCtx = new (window.AudioContext || window.webkitAudioContext)();
  let audSrc;
  let analyser;
  let bufferLength;
  let dataArray;
  let composer;
  const startMusic = () => {
    audCtx.resume();
    audSrc.play();
  };
  const stopMusic = () => {
    audSrc.pause();
    audSrc.load();
    audCtx.suspend();
  };
  useEffect(() => {
    audSrc = audRef.current;

    if (typeof source === "undefined") {
      const source = audCtx.createMediaElementSource(audSrc);
      source.connect(audCtx.destination);
      analyser = audCtx.createAnalyser();
      analyser.fftSize = 32;
      source.connect(analyser);
      source.connect(audCtx.destination);
      bufferLength = analyser.frequencyBinCount;
      dataArray = new Float32Array(bufferLength);
    }
  }, [audSrc]);

  function Bars() {
    const [data, setData] = useState([]);
    useFrame(() => {
      analyser.getFloatTimeDomainData(dataArray);

      setData([...dataArray]);
    });
    return (
      <group position={[0, 0, 0]}>
        {data.map((el, ind) => (
          <mesh
            key={ind}
            position={[ind - bufferLength / 2, 0, 0]}
            scale={[0.2, el * 12, 0.2]}
          >
            <boxGeometry />
            <meshStandardMaterial
              color={`cyan`}
              roughness={0.3}
              metalness={1}
            />
          </mesh>
        ))}
      </group>
    );
  }

  function PixelPass() {
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
  }

  function Camera() {
    const { viewport } = useThree();
    const [isVert, setVert] = useState(false);
    useFrame(() => {
      if (viewport.width < viewport.height) {
        setVert(true);
      } else {
        setVert(false);
      }
    });
    return (
      <group>
        <PerspectiveCamera
          aspect={viewport.aspect}
          fov={65}
          makeDefault={true}
          position={[0, 0, isVert ? 20 : 15]}
        />
        <group
          position={[
            isVert ? -viewport.width / 2 + 2 : -viewport.width / 2 + 10,
            isVert ? -viewport.height / 2 + 2 : -viewport.height / 2 + 6,
            5,
          ]}
          onClick={() => stopMusic()}
        >
          <StopButton />
        </group>
        <group
          position={[
            isVert ? viewport.width / 2 - 2 : viewport.width / 2 - 10,
            isVert ? -viewport.height / 2 + 2 : -viewport.height / 2 + 6,
            5,
          ]}
          onClick={() => startMusic()}
        >
          <PlayButton />
        </group>
      </group>
    );
  }

  function PlayButton() {
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
  }
  function StopButton() {
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
  }

  return (
    <div className="player">
      <Canvas
        className="mediaPlayer"
        gl={{
          powerPreference: "high-performance",
          antialias: false,
          alpha: false,
        }}
      >
        <PixelPass />
        <Camera />
        <ambientLight intensity={0.1} />
        <directionalLight color="white" position={[0, 0, 5]} />
        <React.Suspense fallback={<></>}>
          <Bars />
        </React.Suspense>
      </Canvas>
      {typeof streams === "object" ? (
        <audio
          className="audioSrc"
          crossOrigin="anonymous"
          controls={false}
          ref={audRef}
        >
          {streams.map((source) => (
            <source
              key={source.name}
              src={source.url}
              type={`audio/${source.type}`}
            />
          ))}
        </audio>
      ) : null}
    </div>
  );
};

export default Player;
