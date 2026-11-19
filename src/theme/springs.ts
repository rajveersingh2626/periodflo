/**
 * Apple WWDC & Emil Kowalski Design Engineering Physics
 * - Critically damped defaults for calm settled transitions
 * - Tactile active feedback: scale(0.97) on pointer-down with 160ms ease-out spring
 * - Never scale from 0: elements enter from scale(0.95) with opacity: 0
 */
export const SpringConfigs = {
  // Apple snappy default (damping ~1.0 critically damped)
  snappy: {
    damping: 20,
    stiffness: 300,
    mass: 0.8,
  },
  // Apple gentle / sheet response
  gentle: {
    damping: 26,
    stiffness: 180,
    mass: 1,
  },
  // Emil Kowalski tactile active scale feedback
  tactileScale: 0.97,
  // Emil Kowalski entrance minimum scale (never scale from 0)
  entranceMinScale: 0.95,
  // Duration constants
  pressDurationMs: 160,
  sheetDurationMs: 300,
};
