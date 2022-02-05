import { browser  } from "$app/env";
const noop = (): void => { return }

let tapAudio = { play: noop }
let winAudio = { play: noop }

if (browser) {
  tapAudio = new Audio('/assets/sounds/tap.wav');
  winAudio = new Audio('/assets/sounds/win.wav');
}

export { tapAudio, winAudio };
