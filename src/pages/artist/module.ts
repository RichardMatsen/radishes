import { actions, mutations } from './sage'
import { state } from './state'

export * from './state'
export * from './sage'

export const NAMESPACED = 'Artist'

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
