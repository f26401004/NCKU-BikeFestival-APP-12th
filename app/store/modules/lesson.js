const Firebase = require('nativescript-plugin-firebase')
const Applicaiton = require('tns-core-modules/application')
const ApplicationSettings = require('tns-core-modules/application-settings')

const state = {
  status: false,
  attribute: {
    language: 0,
    humanity: 0,
    logic: 0,
    nature: 0,
    general: 0
  },
  grade: 1,
  onGoing: {
    language: [],
    humanity: [],
    logic: [],
    nature: [],
    general: []
  },
  finished: {
    language: [],
    humanity: [],
    logic: [],
    nature: [],
    general: []
  }
}

const getters = {
  getUserLessonStatus: (state, getters) => {
    return state.status
  },
  getUserLessonAttr: (state, getters) => {
    return state.attribute
  },
  getUserLessonOnGoing: (state, getters) => {
    return state.onGoing
  },
  getUserLessonFinished: (state, getters) => {
    return state.finished
  }
}

const mutations = {
  'SET_LESSON_STATUS': (state, status) => {
    state.status = status
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
  'ADD_LESSON_ONGOING': (state, data) => {
    if (state.status === true) {
      console.log('now is under taking class, you can not add lesson.')
      return
    }
    state.onGoing[data.Type.toLowerCase()].push(data)
  },
  'REMOVE_LESSON_ONGOING': (state, data) => {
    if (state.status === true) {
      console.log('now is under taking class, you can not remove lesson.')
      return
    }
    const index = state.onGoing[data.Type.toLowerCase()].indexOf(data)
    state.onGoing[data.type.toLowerCase()].splice(index, 1)
  },
  'REMOVE_ALL_LESSON_ONGOING': (state) => {
    if (state.status === true) {
      console.log('now is under taking class, you can not remove lesson.')
      return
    }
    for (let type of Object.keys(state.onGoing)) {
      state.onGoing[type] = []
    }
  },
  'ADD_LESSON_FINISHED': (state, data) => {
    if (state.status === false) {
      console.log('now is not under taking class, you can not add lesson.')
      return
    }
    state.finished[data.Type.toLowerCase()].push(data)
  },
  'ADD_LESSON_PROGRESS': (state, data) => {
    if (state.status === false) {
      console.log('now is not under taking class, you can not add lesson.')
      return
    }
    const target = state.onGoing[data.Type.toLowerCase()].find(target => target.Lid === data.Lid)
    target.Loading++
  }
}

const actions = {
  getLessonByType: async ({commit, state, rootState}, type) => {
    try {
      const getLesson = Firebase.functions.httpsCallable('getLessonByType')
      const result = await getLesson({
        type: type,
        uid: rootState.account.uid
      })
      return result
    } catch (error) {
      console.log(error)
    }
  },
  getLessonQuestion: async ({commit, state}, data) => {
    try {
      const getQuestion = Firebase.functions.httpsCallable('getLessonQuestionByLidAndType')
      const result = await getQuestion({
        lid: data.Lid,
        type: data.Type
      })
      return result
    } catch (error) {
      console.log(error)
    }
  },
  addFinishLesson: async ({commit, state, rootState}, data) => {
    try {
      const finishLesson = Firebase.functions.httpsCallable('finishLesson')
      await finishLesson({
        uid: rootState.account.uid,
        lesson: data
      })
    } catch (error) {
      console.log(error)
    }
  },
  learningNow: async ({commit, state, rootState}) => {
    if (!state.status) {
      // TODO: add lesson to user database
      const chooseLesson = Firebase.functions.httpsCallable('chooseLesson')
      const type = ['Language', 'Humanity', 'Logic', 'Nature', 'General']
      for (let iter of type) {
        await chooseLesson({
          uid: rootState.account.uid,
          type: iter,
          lessons: state.onGoing[iter.toLowerCase()]
        })
      }
      // start learning
      const learningNow = Firebase.functions.httpsCallable('learningNow')
      await learningNow({
        uid: rootState.account.uid
      })
    } else {
      console.log('You are under learning!!')
    }
  }
}

export default {
  namespace: true,
  state,
  getters,
  mutations,
  actions
}