export const CLEAR_STATE_VALUE = "CLEAR_STATE_VALUE";
export const ERROR_5XX = "ERROR_5XX";

export function error5xx() {
    return {
        type: ERROR_5XX,
        payload: {data: null, fetching: false}
    }
}

export function clearStateValue() {
  return {
        type: CLEAR_STATE_VALUE,
        payload: []
    }
}
