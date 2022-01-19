import { State } from '@hookstate/core'

import { VolumeStateType } from '../states/volume'

export function volumeDownHelper(volumeState: State<VolumeStateType>) {
  volumeState.set(v => Math.max(0, v - 0.01))
}
