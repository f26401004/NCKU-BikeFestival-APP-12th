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
    nature: 0,
    general: 0
  },
  grade: 1,
  onGoing: {
    language: [{Lid: 'UfOngRFCH9713EzgsbbR', Name: '英文', Grade: 1}, {Lid: 'RUDluSgyqSABRO0hdlC9', Name: '基礎國文', Grade: 1}],
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
  getUserLessonSpantime: (state, getters) => {
    return state.spantime
  },
  getUserLessonOnGoing: (state, getters) => {
    return state.onGoing
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
    const value = data.map(target => {
      return {
        lid: data.Id,
        Name: data.Name
      }
    })
    state.onGoing[data.type.toLowerCase()].push(value)
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
        lid: data.lid,
        type: data.type
      })
      return result
    } catch (error) {
      console.log(error)
    }
  },
  checkLessonQuestion: async ({commit, state}, data) => {
    try {
      if (!data.lid) {
        throw error('Lesson id is not defined!!')
      }
      if (!data.answer) {
        throw error('Answer is not defined!!')
      }
      // TODO: check if user answer is correct
      // and add the result to temp buffer
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
        uid: state.uid
      })
      for (let iter of Object.keys(state.onGoing)) {
        state.spantime += state.onGoing[iter].length * 60
      }
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