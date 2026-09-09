(() => {
  'use strict';

  const get = (id) => document.getElementById(id);
  const canvas = get('game-canvas');
  const ctx = canvas.getContext('2d');
  const status = get('game-status');
  const start = get('start-button');
  const pause = get('pause-button');
  const restart = get('restart-button');
  if (!ctx) {
    status.textContent = 'Canvas is unavailable in this browser.';
    start.disabled = true;
    return;
  }

  const W = canvas.width;
  const H = canvas.height;
  const paddleH = 96;
  const paddleW = 14;
  const margin = 30;
  const radius = 9;
  const keys = new Set();
  const movement = new Set(['KeyW', 'KeyS', 'ArrowUp', 'ArrowDown']);
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
  let player = (H - paddleH) / 2;
  let computer = player;
  let playerScore = 0;
  let computerScore = 0;
  let state = 'ready';
  let wait = 0;
  let last = null;
  const ball = { x: W / 2, y: H / 2, vx: 0, vy: 0 };

  function setState(next, message) {
    state = next;
    keys.clear();
    status.textContent = message;
    start.disabled = next !== 'ready';
    pause.disabled = next !== 'playing' && next !== 'paused';
    pause.textContent = next === 'paused' ? 'Resume' : 'Pause';
    restart.disabled = next === 'ready';
  }

  function serve(direction) {
    ball.x = W / 2;
    ball.y = H / 2;
    const angle = (Math.random() - 0.5) * 0.8;
    ball.vx = direction * 400 * Math.cos(angle);
    ball.vy = 400 * Math.sin(angle);
    wait = 0.8;
  }

  function updateScores() {
    get('player-score').textContent = playerScore;
    get('computer-score').textContent = computerScore;
  }

  function newGame() {
    playerScore = computerScore = 0;
    player = computer = (H - paddleH) / 2;
    updateScores();
    serve(Math.random() < 0.5 ? -1 : 1);
    setState('playing', 'Game on! First to 7 wins.');
    last = null;
    canvas.focus();
  }

  function togglePause() {
    if (state === 'playing') {
      setState('paused', 'Paused. Resume when ready.');
    } else if (state === 'paused') {
      setState('playing', 'Game on! First to 7 wins.');
      last = null;
      canvas.focus();
    }
  }

  function score(forPlayer) {
    if (forPlayer) playerScore += 1;
    else computerScore += 1;
    updateScores();
    if (playerScore === 7 || computerScore === 7) {
      setState('over', `${playerScore === 7 ? 'You win!' : 'Computer wins!'} Final score: ${playerScore} to ${computerScore}. Select Restart to play again.`);
      return;
    }
    status.textContent = `${forPlayer ? 'You score!' : 'Computer scores!'} ${playerScore} to ${computerScore}. Next serve…`;
    serve(forPlayer ? -1 : 1);
  }

  function bounce(paddleY, direction) {
    const offset = clamp((ball.y - paddleY - paddleH / 2) / (paddleH / 2), -1, 1);
    const angle = offset * Math.PI / 3;
    const speed = Math.min(760, Math.hypot(ball.vx, ball.vy) * 1.06);
    ball.vx = direction * speed * Math.cos(angle);
    ball.vy = speed * Math.sin(angle);
  }

  function update(dt) {
    const down = keys.has('KeyS') || keys.has('ArrowDown');
    const up = keys.has('KeyW') || keys.has('ArrowUp');
    player = clamp(player + (Number(down) - Number(up)) * 480 * dt, 0, H - paddleH);
    const target = ball.vx > 0 ? ball.y - paddleH / 2 : (H - paddleH) / 2;
    computer = clamp(computer + clamp(target - computer, -285 * dt, 285 * dt), 0, H - paddleH);
    if (wait > 0) {
      wait = Math.max(0, wait - dt);
      return;
    }

    const previousX = ball.x;
    const previousY = ball.y;
    ball.x += ball.vx * dt;
    ball.y += ball.vy * dt;
    if (ball.y < radius) {
      ball.y = 2 * radius - ball.y;
      ball.vy = Math.abs(ball.vy);
    } else if (ball.y > H - radius) {
      ball.y = 2 * (H - radius) - ball.y;
      ball.vy = -Math.abs(ball.vy);
    }

    const leftFace = margin + paddleW + radius;
    const rightFace = W - margin - paddleW - radius;
    const movingLeft = ball.vx < 0;
    const face = movingLeft ? leftFace : rightFace;
    const crossed = movingLeft
      ? previousX >= face && ball.x <= face
      : previousX <= face && ball.x >= face;
    if (crossed) {
      const fraction = (face - previousX) / (ball.x - previousX);
      const hitY = previousY + (ball.y - previousY) * fraction;
      const paddleY = movingLeft ? player : computer;
      if (hitY + radius >= paddleY && hitY - radius <= paddleY + paddleH) {
        ball.x = face;
        ball.y = hitY;
        bounce(paddleY, movingLeft ? 1 : -1);
      }
    }
    if (ball.x < -radius) score(false);
    else if (ball.x > W + radius) score(true);
  }

  function draw() {
    ctx.fillStyle = '#080d18';
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = '#2c3c57';
    ctx.lineWidth = 3;
    ctx.setLineDash([12, 14]);
    ctx.beginPath();
    ctx.moveTo(W / 2, 0);
    ctx.lineTo(W / 2, H);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#72f5c5';
    ctx.fillRect(margin, player, paddleW, paddleH);
    ctx.fillStyle = '#8ebaff';
    ctx.fillRect(W - margin - paddleW, computer, paddleW, paddleH);
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, radius, 0, Math.PI * 2);
    ctx.fill();

    if (state !== 'playing') {
      ctx.fillStyle = '#080d18cc';
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#e9efff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = 'bold 44px system-ui, sans-serif';
      const title = state === 'ready' ? 'READY TO PLAY?' : state === 'paused' ? 'PAUSED' : playerScore === 7 ? 'YOU WIN!' : 'COMPUTER WINS';
      ctx.fillText(title, W / 2, H / 2 - 20);
      ctx.font = '22px system-ui, sans-serif';
      ctx.fillStyle = '#a7b5d1';
      ctx.fillText(state === 'ready' ? 'Select Start game below' : state === 'paused' ? 'Select Resume to continue' : 'Select Restart for another match', W / 2, H / 2 + 34);
    }
  }

  function frame(now) {
    let remaining = last === null ? 0 : Math.min((now - last) / 1000, 0.05);
    last = now;
    while (remaining > 0 && state === 'playing') {
      const dt = Math.min(remaining, 1 / 240);
      update(dt);
      remaining -= dt;
    }
    draw();
    requestAnimationFrame(frame);
  }

  start.addEventListener('click', newGame);
  restart.addEventListener('click', newGame);
  pause.addEventListener('click', togglePause);
  canvas.addEventListener('keydown', (event) => {
    if (movement.has(event.code)) {
      event.preventDefault();
      if (state === 'playing') keys.add(event.code);
    } else if (event.code === 'Space') {
      event.preventDefault();
      if (!event.repeat) togglePause();
    }
  });
  window.addEventListener('keyup', (event) => keys.delete(event.code));
  const autoPause = () => {
    keys.clear();
    if (state === 'playing') togglePause();
  };
  canvas.addEventListener('blur', autoPause);
  window.addEventListener('blur', autoPause);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) autoPause();
  });
  canvas.addEventListener('pointerdown', () => canvas.focus());
  requestAnimationFrame(frame);
})();
