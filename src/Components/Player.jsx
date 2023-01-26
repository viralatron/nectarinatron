import { PerspectiveCamera, Hud, OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import React, { Suspense, useState } from "react";

import { useEffect, useRef } from "react";
import PixelPass from "../postprocessing/PixelPass.jsx";
import HUD from "../Scenes/HUD.jsx";
import MainScene from "../Scenes/MainScene.jsx";
// separar as scenes pra renderizar à parte

const Player = ({ streams }) => {
  const audRef = useRef(null);
  const audCtx = new (window.AudioContext || window.webkitAudioContext)();

  const data = useRef([]);

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

  const ProcessAudio = () => {
    useFrame(() => {
      analyser.getFloatTimeDomainData(dataArray);
      data.current = [...dataArray];
    });
  };
  return (
    <div className="player">
      <Canvas
        className="mediaPlayer"
        gl={{
          powerPreference: "high-performance",
          antialias: false,
          alpha: true,
        }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 0]} />
        <ambientLight intensity={0.1} />
        <directionalLight color="white" position={[0, 0, 5]} />
        <ProcessAudio />
        <PixelPass />
        <HUD start={startMusic} stop={stopMusic} />
        <mesh scale={200}>
          <torusGeometry args={[1, 0.25, 32, 100]} />
          <meshStandardMaterial />
        </mesh>
        <MainScene data={data} />
        <Suspense fallback={<></>}></Suspense>
        <OrbitControls />
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
