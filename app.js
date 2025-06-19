const { useState, useEffect } = React;

const GRAVITY = 0.5;
const FLAP = -8;
const HOOP_INTERVAL = 2000; // ms
const HOOP_SPEED = 2;
const SQUIRREL_X = 100;
const HOOP_SIZE = 80;

function randomY() {
  return Math.random() * (window.innerHeight - HOOP_SIZE - 100) + 50;
}

function playSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.2);
  } catch (e) {}
}

function App() {
  const [running, setRunning] = useState(true);
  const [squirrelY, setSquirrelY] = useState(window.innerHeight / 2);
  const [velocity, setVelocity] = useState(0);
  const [hoops, setHoops] = useState([
    { id: 0, x: window.innerWidth + 100, y: randomY(), passed: false }
  ]);
  const [score, setScore] = useState(0);
  const [failedHoop, setFailedHoop] = useState(null);
  const [success, setSuccess] = useState(false);

  const flap = () => {
    if (running) {
      setVelocity(FLAP);
      playSound();
    }
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        flap();
      }
    };
    window.addEventListener('keydown', handleKey);
    window.addEventListener('touchstart', flap);
    return () => {
      window.removeEventListener('keydown', handleKey);
      window.removeEventListener('touchstart', flap);
    };
  }, [running]);

  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => {
      setVelocity(v => {
        const nv = v + GRAVITY;
        setSquirrelY(y => Math.max(0, Math.min(y + nv, window.innerHeight - 40)));
        return nv;
      });
      setHoops(hs => hs.map(h => ({ ...h, x: h.x - HOOP_SPEED })));
    }, 20);
    const htimer = setInterval(() => {
      if (failedHoop === null) {
        setHoops(hs => [...hs, { id: Date.now(), x: window.innerWidth + 50, y: randomY(), passed: false }]);
      }
    }, HOOP_INTERVAL);
    return () => {
      clearInterval(timer);
      clearInterval(htimer);
    };
  }, [running, failedHoop]);

  useEffect(() => {
    if (!running) return;
    hoops.forEach(h => {
      if (!h.passed && h.x <= SQUIRREL_X + 30) {
        if (Math.abs(squirrelY - h.y) <= HOOP_SIZE / 2) {
          h.passed = true;
          setScore(s => s + 1);
          setSuccess(true);
          setTimeout(() => setSuccess(false), 300);
        } else if (failedHoop === null) {
          setFailedHoop(h.id);
        }
      }
    });
    setHoops(hs => hs.filter(h => h.x > -HOOP_SIZE));
  }, [hoops, squirrelY, running, failedHoop]);

  useEffect(() => {
    if (failedHoop === null) return;
    const h = hoops.find(h => h.id === failedHoop);
    if (!h || h.x <= -HOOP_SIZE) {
      setRunning(false);
      setFailedHoop(null);
    }
  }, [hoops, failedHoop]);

  const restart = () => {
    setScore(0);
    setVelocity(0);
    setSquirrelY(window.innerHeight / 2);
    setHoops([{ id: Date.now(), x: window.innerWidth + 100, y: randomY(), passed: false }]);
    setFailedHoop(null);
    setRunning(true);
  };

  return (
    React.createElement('div', { id: 'game' },
      React.createElement('div', { className: 'score' }, score),
      React.createElement('div', {
        className: `squirrel${success ? ' success' : ''}`,
        style: { transform: `translate(${SQUIRREL_X}px, ${squirrelY}px) scaleX(1)` }
      }),
      hoops.map(h => React.createElement('div', {
        key: h.id,
        className: 'hoop',
        style: { transform: `translate(${h.x}px, ${h.y}px)` }
      })),
      !running && React.createElement('div', { className: 'game-over' },
        React.createElement('div', null, 'Game Over'),
        React.createElement('button', { className: 'restart', onClick: restart }, 'Restart')
      )
    )
  );
}

ReactDOM.render(React.createElement(App), document.getElementById('root'));

