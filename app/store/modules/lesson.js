const Firebase = require('nativescript-plugin-firebase')
const Applicaiton = require('tns-core-modules/application')
const ApplicationSettings = require('tns-core-modules/application-settings')

const state = {
  status: false,
  spantime: 0,
  attribute: {
    language: 0,
    humanity: 0,
    logic: 0,
    nature: 0
  },
  grade: 1,
  currentSyllabs: []
}

const getters = {
  getUserLessonStatus: (state, getters) => {
    return state.status
  },
  getUserLessonAttr: (state, getters) => {
    return state.attribute
  },
  getUserLessonSpantime: (state, getters) => {
    return state.spantime
  }
}

const mutations = {
  'SET_LESSON_STATUS': (state, status) => {
    state.status = status
  },
  'SET_LESSON_SPANTIME': (state, time) => {
    state.spantime = time
  },
  'ADD_LESSON_ATTRIBUTE': (state, data) => {
    if (data['language']) {
      state.attribute['language'] += data['language']
    }
    if (data['humanity']) {
      state.attribute['humanity'] += data['humanity']
    }
    if (data['logic']) {
      state.attribute['logic'] += data['logic']
    }
    if (data['nature']) {
      state.attribute['nature'] += data['nature']
    }
  },
  'ADD_LESSON_SYLLABUS': (state, data) => {
    if (state.status === true) {
      console.log('now is under taking class, you can not add lesson.')
      return
    }
    if (Array.isArray(data)) {
      for (iter of data) {
        state.currentSyllabs.push(iter)
      }
      return
    }
    if (typeof data === 'string') {
      state.currentSyllabs.push(data)
      return
    }
  }
}

const actions = {
  getLessonQuestion: async ({commit, state}, lid) => {
    try {
      // TODO: get lesson question.
    } catch (error) {
    }
  },
  checkLessonQuestion: async (({commit, state}, lid) => {
    try {
      // TODO: check if user answer is correct
      // and add the result to temp buffer
    } catch (error) {

    }
  })
}

export default {
  namespace: true,
  state,
  getters,
  mutations,
  actions
}