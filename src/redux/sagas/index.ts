import { call, put, takeLeading } from "redux-saga/effects";

export interface ResponseGenerator {
  config?: any;
  data?: any;
  headers?: any;
  request?: any;
  status?: number;
  statusText?: string;
}
// worker Saga: will be fired on USER_FETCH_REQUESTED actions
function* fetchUser(action: any) {
  try {
    // const test = call(() => {} as any, action.payload.userId);
    // const user: ResponseGenerator = yield test;
    yield put({ type: "USER_FETCH_SUCCEEDED", user: {} });
  } catch (e: any) {
    yield put({ type: "USER_FETCH_FAILED", message: e.message });
  }
}

/*
  Starts fetchUser on each dispatched `USER_FETCH_REQUESTED` action.
  Allows concurrent fetches of user.
*/
function* mySaga() {
  yield takeLeading("USER_FETCH_REQUESTED", fetchUser);
}

export default mySaga;
