const Controls = ({ start, stop }) => {
  return (
    <div className="player__controls">
      <button className="player__button" onClick={() => stop()}>
        Stop
      </button>
      <button className="player__button" onClick={() => start()}>
        Play
      </button>
    </div>
  );
};

export default Controls;
