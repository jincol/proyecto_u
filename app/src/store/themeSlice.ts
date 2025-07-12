import { createSlice } from "@reduxjs/toolkit";

const mode = localStorage.getItem("theme") || "light";

const themeSlice = createSlice({
  name: "theme",
  initialState: { mode },
  reducers: {
    toggle(state) {
      state.mode = state.mode === "dark" ? "light" : "dark";
      localStorage.setItem("theme", state.mode);
    },
    set(state, action) {
      state.mode = action.payload;
      localStorage.setItem("theme", state.mode);
    },
  },
});

export const { toggle, set } = themeSlice.actions;
export default themeSlice.reducer;