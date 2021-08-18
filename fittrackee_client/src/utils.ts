import { AxiosError } from 'axios'
import { ActionContext } from 'vuex'
import { ROOT_STORE } from '@/store/constants'
import { IUserState } from '@/store/modules/user/interfaces'
import { IRootState } from '@/store/modules/root/interfaces'

export const getApiUrl = (): string => {
  return process.env.NODE_ENV === 'production'
    ? '/api'
    : `${process.env.VUE_APP_API_URL}/api/`
}

// TODO: update api error messages to remove these workarounds
const removeLastEndOfLine = (text: string): string => text.replace(/\n$/gm, '')
const removeLastDot = (text: string): string => text.replace(/\.$/gm, '')
export const handleError = (
  context:
    | ActionContext<IRootState, IRootState>
    | ActionContext<IUserState, IRootState>,
  error: AxiosError | null,
  msg = 'UNKNOWN'
): void => {
  let errorMessages = !error
    ? msg
    : error.response
    ? error.response.data.message
      ? error.response.data.message
      : msg
    : error.message
    ? error.message
    : msg
  errorMessages = removeLastEndOfLine(errorMessages)
  context.commit(
    ROOT_STORE.MUTATIONS.SET_ERROR_MESSAGES,
    errorMessages.includes('\n')
      ? errorMessages
          .split('\n')
          .map((m: string) => `api.ERROR.${removeLastDot(m)}`)
      : `api.ERROR.${removeLastDot(errorMessages)}`
  )
}

export const capitalize = (text: string): string =>
  text.charAt(0).toUpperCase() + text.slice(1)
