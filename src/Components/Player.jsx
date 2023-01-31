import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import React, { Suspense, useState } from "react";

import { useEffect, useRef } from "react";
import MainScene from "../Scenes/MainScene.jsx";
import Controls from "./Controls.jsx";

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
      dataArray = new Float32Array(8);
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
        shadows
        gl={{
          antialias: false,
        }}
        camera={{
          position: [0, 30, 30],
          fov: 85,
          near: 1,
          far: 10000,
          castShadow: false,
        }}
      >
        <ProcessAudio />
        <color attach="background" args={["#8173C9"]} />
        <Suspense fallback={<></>}>
          <MainScene data={data} />
        </Suspense>
        <OrbitControls makeDefault />
      </Canvas>
      <Controls start={startMusic} stop={stopMusic} />
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
