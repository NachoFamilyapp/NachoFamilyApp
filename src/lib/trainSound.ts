// Synthetiseert een treinhoorn-achtig geluid met de Web Audio API.
// Geen los geluidsbestand nodig — dit klinkt door meerdere tonen
// tegelijk te laten samenklinken, zoals een echte treinhoorn.

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;

    audioContext = new AudioContextClass();
  }

  if (audioContext.state === "suspended") {
    audioContext.resume();
  }

  return audioContext;
}

/**
 * Roep dit aan vanuit een echte tik/klik van de gebruiker, zodat de
 * browser geluid toestaat voordat er later automatisch geluid moet
 * afspelen tijdens het knipperen.
 */
export function ontgrendelGeluid() {
  try {
    getAudioContext();
  } catch (error) {
    console.error("Geluid kon niet worden geactiveerd:", error);
  }
}

/**
 * Speel een korte treinhoorn-toon af, met de gegeven duur in
 * milliseconden (gelijk aan hoelang het lampje op "aan" staat).
 */
export function speelTreinToon(duurMs: number) {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const duurSec = duurMs / 1000;

    // Klassieke samengestelde treinhoorn-clusterklank.
    const frequenties = [311.1, 370.0, 466.2];

    const master = ctx.createGain();
    master.gain.setValueAtTime(0, now);
    master.gain.linearRampToValueAtTime(0.22, now + 0.03);
    master.gain.setValueAtTime(0.22, now + Math.max(0.03, duurSec - 0.05));
    master.gain.linearRampToValueAtTime(0, now + duurSec);
    master.connect(ctx.destination);

    frequenties.forEach((freq) => {
      const osc = ctx.createOscillator();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(freq, now);
      osc.connect(master);
      osc.start(now);
      osc.stop(now + duurSec + 0.02);
    });
  } catch (error) {
    console.error("Geluid afspelen mislukt:", error);
  }
}
