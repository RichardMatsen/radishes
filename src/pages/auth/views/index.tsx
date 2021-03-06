/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/camelcase,vue/require-default-prop,@typescript-eslint/ban-ts-ignore*/
import {
  computed,
  defineComponent,
  reactive,
  Transition,
  provide,
  watch,
  KeepAlive
} from 'vue'
import { useAuth } from '@/hooks/auth'
import { PhoneLogin } from './phone-login'
import { ResetPwd } from './reset-pwd'
import { Signup } from './signup'
import { EmailLogin } from './email-login'
import { AuthView } from '../component/auth-view'
import { AUTH_TYPE, PROVIDER_AUTH_UTIL } from '../constant'

const authComponent = [PhoneLogin, EmailLogin, Signup, ResetPwd]

export const AuthBox = defineComponent({
  name: 'AuthBox',

  setup() {
    const { isShow } = useAuth()
    const state = reactive({
      authType: AUTH_TYPE.PHONE_LOGIN
    })

    const Component: any = computed(() => authComponent[state.authType])

    provide(PROVIDER_AUTH_UTIL, {
      to: (type: number) => {
        state.authType = type
      }
    })

    watch(
      () => isShow.value,
      n => {
        if (n) {
          state.authType = AUTH_TYPE.PHONE_LOGIN
        }
      }
    )

    return () => (
      <Transition name="fade">
        {isShow.value ? (
          <AuthView>
            {/* <Transition name="fade"> */}
            <KeepAlive>
              <Component.value></Component.value>
            </KeepAlive>
            {/* </Transition> */}
          </AuthView>
        ) : null}
      </Transition>
    )
  }
})
