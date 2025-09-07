import { createStore, applyMiddleware } from "redux";
import { createMigrate, persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";
import createSagaMiddleware from "redux-saga";
import sagas from "../redux/sagas";
import migrations from "../redux/persist-migration";
import createReducers from "Redux/reducers";
import { composeWithDevTools } from "redux-devtools-extension";

const persistConfig = {
  key: "primary",
  timeout: 0,
  storage,
  whitelist: ["loginReducers", "configReducers", "persistReducers"],
  stateReconciler: autoMergeLevel2,
  version: 5,
  // transforms: [saveSubsetFilter],
  migrate: createMigrate(migrations, { debug: false }),
};

export default function configureStore() {
  const sagaMiddleware = createSagaMiddleware();
  const middlewares = [sagaMiddleware];
  const reducers = createReducers();
  const finalReducer = persistReducer(persistConfig, reducers as any);
  const store = createStore(
    finalReducer,
    composeWithDevTools(applyMiddleware(...middlewares))
  );
  sagaMiddleware.run(sagas);
  const persistor = persistStore(store);
  return { store, persistor };
}

// Connect our store to the reducers
