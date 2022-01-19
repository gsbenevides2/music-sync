import { State } from '@hookstate/core'

import { VolumeStateType } from '../states/volume'

export function volumeUpHelper(volumeState: State<VolumeStateType>) {
  volumeState.set(v => Math.min(1, v + 0.01))
}
