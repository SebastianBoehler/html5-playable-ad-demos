window.SpeakerUI = (C) => {
  const refs = {
    wave: document.querySelector("#waveText"),
    coins: document.querySelector("#coinText"),
    lives: document.querySelector("#lifeText"),
    toast: document.querySelector("#toast"),
    start: document.querySelector("#startScreen"),
    end: document.querySelector("#endScreen"),
    endEyebrow: document.querySelector("#endEyebrow"),
    endTitle: document.querySelector("#endTitle"),
    endCopy: document.querySelector("#endCopy")
  };
  let toastTimer = 0;

  function toast(message) {
    refs.toast.textContent = message;
    refs.toast.classList.add("pop");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => refs.toast.classList.remove("pop"), 180);
  }

  function updateHud(state) {
    refs.wave.textContent = `${Math.min(state.waveIndex + 1, C.waves.length)}/${C.waves.length}`;
    refs.coins.textContent = state.coins;
    refs.lives.textContent = Math.max(0, state.lives);
  }

  function showPlaying() {
    refs.start.classList.add("hidden");
    refs.end.classList.add("hidden");
  }

  function showEnd(won) {
    refs.endEyebrow.textContent = won ? "Party saved" : "Party breached";
    refs.endTitle.textContent = won ? C.copy.winTitle : C.copy.loseTitle;
    refs.endCopy.textContent = won ? C.copy.winBody : C.copy.loseBody;
    refs.end.classList.remove("hidden");
  }

  return {
    buttons: {
      start: document.querySelector("#startButton"),
      restart: document.querySelector("#restartButton"),
      cta: document.querySelector("#ctaButton")
    },
    showPlaying,
    showEnd,
    toast,
    updateHud
  };
};
