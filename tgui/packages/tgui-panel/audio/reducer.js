/**
 * @file
 * @copyright 2020 Aleksej Komarov
 * @license MIT
 */

const initialState = {
  visible: false,
  playing: false,
  track: null,
  jukebox: {},
  muted: [],
};

const visible = (state, payload) => {
  let visible = !!state.meta;
  if (!visible) {
    for (const key of Object.keys(state.jukebox)) {
      if (payload && key === payload.jukeboxId) continue;
      if (state.jukebox[key]) {
        visible = true;
        break;
      }
    }
  }
  return visible;
};

export const audioReducer = (state = initialState, action) => {
  const { type, payload } = action;
  if (type === 'audio/playing') {
    return {
      ...state,
      visible: true,
      playing: true,
    };
  }
  if (type === 'audio/stopped') {
    return {
      ...state,
      visible: visible(state),
      playing: false,
    };
  }
  if (type === 'audio/playMusic') {
    return {
      ...state,
      meta: payload,
    };
  }
  if (type === 'audio/stopMusic') {
    return {
      ...state,
      visible: visible(state),
      playing: false,
      meta: null,
    };
  }
  if (type === 'audio/toggle') {
    return {
      ...state,
      visible: !state.visible,
    };
  }
  if (type === 'audio/jukebox/playing') {
    return {
      ...state,
      visible: true,
    };
  }
  if (type === 'audio/jukebox/stopped') {
    return {
      ...state,
      visible: visible(state, payload),
      jukebox: {
        ...state.jukebox,
        [payload.jukeboxId]: null,
      },
    };
  }
  if (type === 'audio/jukebox/create') {
    return {
      ...state,
      jukebox: {
        ...state.jukebox,
        [payload.jukeboxId]: null,
      },
    };
  }
  if (type === 'audio/jukebox/destroy') {
    const jukebox = { ...state.jukebox };
    delete jukebox[payload.jukeboxId];

    return {
      ...state,
      visible: visible(state, payload),
      jukebox,
    };
  }
  if (type === 'audio/jukebox/playMusic') {
    return {
      ...state,
      jukebox: {
        ...state.jukebox,
        [payload.jukeboxId]: payload,
      },
    };
  }
  if (type === 'audio/jukebox/toggleMute') {
    const muted = state.muted;

    if (muted.includes(payload.jukeboxId)) {
      muted.splice(muted.indexOf(payload.jukebox), 1);
    } else {
      muted.push(payload.jukeboxId);
    }

    return {
      ...state,
      muted,
    };
  }
  return state;
};
