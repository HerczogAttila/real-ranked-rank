export const START_GET_DATA = 'START_GET_DATA';
export const SUCCESS_GET_DATA = 'SUCCESS_GET_DATA';
export const FAIL_GET_DATA = 'FAIL_GET_DATA';

export const startGetData = (name: string) => {
  return { type: START_GET_DATA, name };
};

export const successGetData = (data: any, cheat: boolean) => {
  return { type: SUCCESS_GET_DATA, data, cheat };
};

export const failGetData = (error: any) => {
  return { type: FAIL_GET_DATA, error };
};
