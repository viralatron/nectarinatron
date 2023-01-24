import { CameraShake, PerspectiveCamera } from "@react-three/drei";
import {
  Canvas,
  extend,
  useFrame,
  useLoader,
  useThree,
} from "@react-three/fiber";
import React, { Suspense, useState } from "react";

import { useEffect, useRef } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const Player = ({ streams }) => {
  const canvasRef = useRef(null);
  const audRef = useRef(null);
  const audCtx = new (window.AudioContext || window.webkitAudioContext)();
  let audSrc;
  let analyser;
  let bufferLength;
  let dataArray;
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
    const { viewport } = useThree();
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
              color={`rgba(100%, ${el * 100}%, ${el * 100}%)`}
            />
          </mesh>
        ))}
      </group>
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
        <primitive
          ref={meshRef}
          object={gltf.scene}
          scale={0.75}
          color={"red"}
        />
      </Suspense>
    );
  }

  return (
    <div className="player">
      <Canvas className="mediaPlayer">
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
