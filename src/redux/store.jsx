import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { rootReducer } from "./reducer";

const persistConfig = {
  key: "persist-key",
  storage,
};
const persist_reducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persist_reducer,
});
const parsistor = persistStore(store);
export default store;
export { parsistor };
