import { defineComponent, computed, toRefs, watch, toRaw } from 'vue'
import { uesModuleStore } from '@/hooks/index'
import { toFixed } from '@/utils/index'
import {
  NAMESPACED as LayoutNamespace,
  State as LayoutState
} from '@/layout/module'
import { NAMESPACED, FooterState, Getter, FooterMutations } from '../../module'
import { Platform } from '@/config/build'
import LyriceFlash from './index'
import { importIpc } from '@/electron/event/ipc-browser'
import { LyriceAction, UpdateType } from '@/electron/event/action-types'
import './index.less'

const { VUE_APP_PLATFORM } = process.env

export const ipcUpdateLyrice = (type: UpdateType, payload?: unknown) => {
  importIpc().then(event => {
    event.sendAsyncIpcRendererEvent(LyriceAction.LYRICE_UPDATE, {
      type: type,
      payload: toRaw(payload)
    })
  })
}

export const BrowserLyriceFlash = defineComponent({
  name: 'BrowserLyriceFlash',
  setup() {
    const { useState, useGetter, useMutations } = uesModuleStore<
      FooterState,
      Getter
    >(NAMESPACED)
    const LayoutModule = uesModuleStore<LayoutState>(LayoutNamespace)

    const { currentTime, playing, visibleFlash } = toRefs(useState())
    const { screenSize } = toRefs(LayoutModule.useState())

    if (VUE_APP_PLATFORM === Platform.ELECTRON) {
      useMutations(FooterMutations.VISIBLE_FLASH, true)
    }

    const lyrice = computed(() =>
      useGetter('musicLyrics').filter(value => value.lyric)
    )

    const index = computed(() => {
      if (visibleFlash.value) {
        const len = lyrice.value.length
        return (
          lyrice.value.findIndex((value, index) => {
            return currentTime.value >= value.time && len - 1 === index
              ? true
              : currentTime.value < lyrice.value[index + 1]?.time
          }) || 0
        )
      }
      return 0
    })

    const flashMagic = computed(() => {
      if (visibleFlash.value) {
        const cur = lyrice.value[index.value]
        // const schedule = cur.duration - (currentTime.value - cur.time)
        const d = toFixed(cur?.duration, 2)
        if (d) {
          return {
            animationDuration: `${d}s`
          }
        } else {
          return {
            animationDuration: ''
          }
        }
      }
      return {
        animationDuration: ''
      }
    })

    if (VUE_APP_PLATFORM === Platform.ELECTRON) {
      watch(flashMagic, v => {
        ipcUpdateLyrice(UpdateType.UPDATE_MAGIC, v)
      })
      watch(index, v => {
        ipcUpdateLyrice(UpdateType.UPDATE_INDEX, v)
      })
      watch(lyrice, v => {
        ipcUpdateLyrice(UpdateType.UPDATE_LYRICE, v)
      })
      watch(playing, v => {
        ipcUpdateLyrice(UpdateType.UPDATE_PLAYING, v)
      })
    }

    return () => (
      <>
        {VUE_APP_PLATFORM === Platform.BROWSER && (
          <LyriceFlash
            screenSize={screenSize.value}
            visibleFlash={visibleFlash.value}
            lyrice={lyrice.value}
            index={index.value}
            playing={playing.value}
            flashMagic={flashMagic.value}
          ></LyriceFlash>
        )}
      </>
    )
  }
})
