import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "./mockApi";
import { sanitizeMemberInput } from "./sanitize";

const initialState = {
  items: [],
  status: "idle", // idle | loading | succeeded | failed
  error: null,
  mutationStatus: "idle", // tracks add/edit/delete calls separately from the list fetch
  mutationError: null,
};

export const loadMembers = createAsyncThunk(
  "members/load",
  async (_, { rejectWithValue }) => {
    try {
      return await api.fetchMembers();
    } catch (err) {
      return rejectWithValue(err.message || "Couldn't load members.");
    }
  }
);

export const addMember = createAsyncThunk(
  "members/add",
  async (payload, { rejectWithValue }) => {
    try {
      const clean = sanitizeMemberInput(payload);
      return await api.createMember(clean);
    } catch (err) {
      return rejectWithValue(err.message || "Couldn't save the new member.");
    }
  }
);

export const editMember = createAsyncThunk(
  "members/edit",
  async ({ id, changes }, { rejectWithValue }) => {
    try {
      const clean = sanitizeMemberInput(changes);
      return await api.updateMember(id, clean);
    } catch (err) {
      return rejectWithValue(err.message || "Couldn't update this member.");
    }
  }
);

export const removeMember = createAsyncThunk(
  "members/remove",
  async (id, { rejectWithValue }) => {
    try {
      await api.deleteMember(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.message || "Couldn't remove this member.");
    }
  }
);

const membersSlice = createSlice({
  name: "members",
  initialState,
  reducers: {
    clearMutationError(state) {
      state.mutationError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch list
      .addCase(loadMembers.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loadMembers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(loadMembers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Something went wrong.";
      })
      // Add
      .addCase(addMember.pending, (state) => {
        state.mutationStatus = "loading";
        state.mutationError = null;
      })
      .addCase(addMember.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";
        state.items.unshift(action.payload);
      })
      .addCase(addMember.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.mutationError = action.payload;
      })
      // Edit
      .addCase(editMember.pending, (state) => {
        state.mutationStatus = "loading";
        state.mutationError = null;
      })
      .addCase(editMember.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";
        const idx = state.items.findIndex((m) => m.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(editMember.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.mutationError = action.payload;
      })
      // Delete
      .addCase(removeMember.pending, (state) => {
        state.mutationStatus = "loading";
        state.mutationError = null;
      })
      .addCase(removeMember.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";
        state.items = state.items.filter((m) => m.id !== action.payload);
      })
      .addCase(removeMember.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.mutationError = action.payload;
      });
  },
});

export const { clearMutationError } = membersSlice.actions;
export default membersSlice.reducer;
