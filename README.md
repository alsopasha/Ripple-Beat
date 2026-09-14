# Ripple Beat

Ripple Beat is a metronome that records where each tap lands around a pendulum arc. The sound and the drawing share the Web Audio clock, so the timing display is not dependent on the browser's frame rate.

[kivilcimlab.org/ripplebeat](https://kivilcimlab.org/ripplebeat)

## Scheduling the beat

A timer wakes the scheduler every 25 ms, but it does not play notes directly. Instead, it places oscillator start times onto `AudioContext.currentTime` up to 100 ms ahead. Once scheduled, the audio thread starts those notes independently of delays on the main thread.

Each beat time is calculated from the original start time and an integer index:

`firstBeatTime + beatIndex × (60 / bpm)`

This avoids accumulating floating point and callback timing errors from one beat to the next. Changing the tempo establishes a new origin and starts the next beat one full interval later.

## Scoring a tap

The pendulum angle is derived from elapsed audio time, not animation time. A tap is moved back by 25 ms as a fixed allowance for input latency, then evaluated at that corrected point on the beat cycle.

Marks near the centre of the arc are closest to the beat and appear brick. Less accurate taps move towards teal and then near black. The wave at the bottom receives a ripple at the corresponding horizontal position and eases towards the mark colour.

Ripple force is fixed. Accuracy changes the mark and wave colour, not the amplitude. Once one hundred marks have been recorded, further taps are ignored while the metronome continues running.

## Implementation

`js/AudioEngine.js` owns the clock, scheduler, and oscillator envelopes. `js/Visualiser.js` draws the water and tap marks. `js/main.js` connects input, tempo changes, and animation.
