import Vue from 'vue'
import Vuex from 'vuex'
import toastr from 'toastr'
import axios from 'axios'
import support from './support.json'
import $ from 'jquery'
// import router from '@/router'

Vue.use(toastr)
Vue.use(Vuex)
export const store = new Vuex.Store({
  state: {
    initData: null,
    loading: false,
    loadingTable: false,
    loadingSubmit: false,
    error: null,
    docTypes: null,
    roleFilterStatus: null,
    userSignsData: null,
    otherData: {},
    itineraryNo: null,
    detailHs: null,
    maritimeCode: '',
    thongTinChung: {},
    thongTinXuong: {},
    thongTinDoanhNghiep: {},
    history: {},
    cssxModel: {}
  },
  actions: {
    clearError ({commit}) {
      commit('clearError')
    },
    loadInitResource ({commit, state}) {
      if (state.initData == null) {
        return new Promise(function (resolve, reject) {
          let param = {}
          let orginURL = window.location.href
          let coma = window.location.href.lastIndexOf('#/')
          if (coma > 0) {
            orginURL = window.location.href.substr(0, coma)
          }
          var url1 = new Promise(function (resolve, reject) {
            axios.get(orginURL + support.renderURLInit, param).then(function (response) {
              let serializable = response.data
              resolve(serializable)
            }).catch(function (error) {
              console.log(error)
              reject(error)
            })
          })
          Promise.all([url1]).then(function (results) {
            var data = results[0]
            console.log('InitData============>>>>', data)
            commit('setInitData', data)
            resolve(data)
          }).catch(function (xhr) {
            commit('setInitData', null)
            reject(null)
          })
        })
      } else {
        return new Promise((resolve, reject) => {
          resolve(state.initData)
        })
      }
    },
    loadHistoryUpdate ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          var url = '/o/rest/vr-app/historyprofile/applicantprofile/' + data['applicantCode']
          var configs = {
            headers: {
              groupId: state.initData['groupId']
            },
            params: {
              owner: true,
              ...data
            }
          }
          axios.get(url, configs).then(function (response) {
            var serializable = response.data
            resolve(serializable)
          }).catch(function (error) {
            console.log(error)
            reject(error)
          })
        })
      })
    },
    uploadFileFormDN ({commit, state}, data) {
      let form = data['inputFile']
      let dataTmp = new FormData()
      dataTmp.append('file', form.files[0])
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          $.ajax({
            headers: { 'groupId': state.initData['groupId'] },
            type: 'POST',
            url: '/o/rest/v2/dossiers/formfiles',
            data: dataTmp,
            processData: false,
            contentType: false,
            dataType: 'json',
            cache: false,
            timeout: 600000,
            success: function (data) {
              resolve(data)
            },
            error: function (xhr) {
              reject(data)
            }
          })
        })
      })
    },
    getDictItem ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          $.ajax({
            url: '/o/rest/v2/dictcollections/' + data['dictItemCode'] + '/dictitems',
            dataType: 'json',
            type: 'GET',
            headers: {
              'groupId': state.initData['groupId']
            },
            data: data,
            success: function (result) {
              resolve(result)
            },
            error: function (result) {
              reject(result)
            }
          })
        })
      })
    },
    loadRegistrationTemplate ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          $.ajax({
            url: '/o/rest/v2/registrationtemplates',
            dataType: 'json',
            type: 'GET',
            headers: {
              'groupId': state.initData['groupId']
            },
            data: {
            },
            success: function (result) {
              resolve(result)
            },
            error: function (xhr) {
              reject(xhr)
            }
          })
        })
      })
    },
    addForm ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          $.ajax({
            url: '/o/rest/v2/registrations/' + data.registrationId + '/forms/' + data['formNo'],
            dataType: 'json',
            type: 'POST',
            headers: {
              'groupId': state.initData['groupId']
            },
            data: {
            },
            success: function (result) {
              resolve(result)
            },
            error: function (result) {
              reject(result)
            }
          })
        })
      })
    },
    saveThongTin ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let configs = {
            headers: {
              groupId: state.initData['groupId']
            },
            params: {
            }
          }
          axios.post('/o/dklr/post', data, configs).then(function (response) {
            var serializable = response.data
            resolve(serializable)
          }).catch(function (error) {
            console.log(error)
            reject(error)
          })
        })
      })
    },
    getThongTinXuong ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          /* eslint-disable */
          var url = '/o/rest/vr-app/production/plant/' + data['productionPlantCode']
          $.ajax({
            url: url,
            dataType: 'json',
            type: 'GET',
            headers: {
              'groupId': state.initData['groupId'],
              Accept: 'application/json'
            },
            data: {
            },
            success: function (result){
              resolve(result)
            },
            error: function (result){
              reject(result)
            }
          })
          /* eslint-disable */
        })
      })
    },
    getThongTinChung ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          /* eslint-disable */
          var url = '/o/rest/vr-app/applicant/profile/' + data['applicantCode']
          $.ajax({
            url: url,
            dataType: 'json',
            type: 'GET',
            headers: {
              'groupId': state.initData['groupId'],
              'Accept': 'application/json'
            },
            data: {
              mtCore: 1
            },
            success: function (result){
              commit('setThongTinChung', result)
              resolve(result)
            },
            error: function (result){
              reject(result)
            }
          })
          /* eslint-disable */
        })
      })
    },
    loadTrackChange ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          /* eslint-disable */
          var url = '/o/rest/vr-app/trackchanges/applicantprofile/' + data['applicantCode'] || result['applicant']['applicantIdNo']
          data['mtCore'] = 1
          $.ajax({
            url: url,
            dataType: 'json',
            type: 'GET',
            headers: {
              'groupId': state.initData['groupId'],
              'Accept': 'application/json'
            },
            data: data,
            success: function (result){
              commit('setTrackChanges', result)
              resolve(result)
            },
            error: function (result){
              reject(result)
            }
          })
          /* eslint-disable */
        })
      })
    },
    getDsNhaXuong ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          /* eslint-disable */
          var url = '/o/rest/vr-app/production/plant/search'
          data['mtCore'] = 1
          $.ajax({
            url: url,
            dataType: 'json',
            type: 'GET',
            headers: {
              'groupId': state.initData['groupId'],
              'Accept': 'application/json'
            },
            data: data,
            success: function (result){
              resolve(result)
            },
            error: function (result){
              reject(result)
            }
          })
          /* eslint-disable */
        })
      })
    },
    getFormData ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          /* eslint-disable */
          var url = '/o/rest/v2/registrations/' + data['registrationId'] + '/forms/' + data['referenceUid'] + '/formdata'
          $.ajax({
            url: url,
            dataType: 'json',
            type: 'GET',
            headers: {
              'groupId': state.initData['groupId'],
              Accept: 'application/json'
            },
            data: {
            },
            success: function (result){
              resolve(result)
            },
            error: function (result){
              reject(result)
            }
          })
          /* eslint-disable */
        })
      })
    },
    deleteXuong ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          $.ajax({
            url: '/o/rest/vr-app/production/plant/' + data['id'],
            type: 'DELETE',
            dataType: 'text',
            headers: {
              'groupId': state.initData['groupId'],
            },
            success: function (result) {
              resolve(result)
            },
            error: function (xhr) {
              reject(xhr)
            }
          })
        })
      })
    },
    saveForm ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          /* eslint-disable */
          var url = '/o/rest/v2/registrations/' + data['registrationId'] + '/forms/' + data['referenceUid'] + '/formdata'
          $.ajax({
            url: url,
            dataType: 'json',
            type: 'PUT',
            headers: {
              'groupId': state.initData['groupId'],
              Accept: 'application/json'
            },
            data: {
              formdata: JSON.stringify(data.value)
            },
            success: function (result){
              resolve(result)
            },
            error: function (result){
              reject(result)
            }
          })
          /* eslint-disable */
        })
      })
    },
    saveRegistration ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let type = data['type'] || 'PUT'
          var url = ''
          if (data['type'] === 'POST') {
            url = '/o/rest/v2/registrations'
          } else {
            url = '/o/rest/v2/registrations/' + data['registrationId']
          }
          $.ajax({
            url: url,
            dataType: "json",
            type: type,
            headers: {
              groupId: state.initData['groupId']
            },
            data: data,
            success: function (result) {
              resolve(result)
            },
            error: function (xhr) {
              reject(xhr)
            }
          })
        })
      })
    },
    showAlpacaJSFORMRegist ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          /* eslint-disable */
          var url = '/o/rest/v2/registrations/' + data['registrationId'] + '/forms/' + data['referenceUid'] + '/formscript'
          let alapcaJSRei = {}
          window.$('#formPartNo' + data['formNo']).empty()
          let config = {
            headers: {
              groupId: state.initData['groupId']
            }
          }
          axios.get(url, config).then(function (response) {
            var serializable = response.data
            alapcaJSRei = eval('(' + serializable + ')')
            axios.get('/o/rest/v2/registrations/' + data['registrationId'] + '/forms/' + data['referenceUid'] + '/formdata', config).then(function (responseFormData) {
              alapcaJSRei['data'] = responseFormData.data
              if (data['addNew']) {
                alapcaJSRei['data']['dia_chi_chinh_doanh_nghiep'] = result.applicant['address']
                alapcaJSRei['data']['email_doanh_nghiep'] = result.applicant['contactEmail']
                alapcaJSRei['data']['ten_doanh_nghiep'] = result.applicant['applicantName']
                alapcaJSRei['data']['ma_so_doanh_nghiep'] = result.applicant['applicantIdNo']
                alapcaJSRei['data']['so_dien_thoai_doanh_nghiep'] = result.applicant['contactTelNo']
                alapcaJSRei['data']['nguoi_dai_dien_doanh_nghiep'] = result.applicant['contactName']
                alapcaJSRei['data']['chuc_danh_dai_dien_doanh_nghiep'] = result.applicant['representativeEnterprise']
              }
              window.$('#formPartNo' + data['formNo']).alpaca(alapcaJSRei)
              resolve(alapcaJSRei)
            }).catch(function (xhr) {
              reject(xhr)
            })
          }).catch(function (xhr) {
            reject(xhr)
          })
          /* eslint-disable */
        })
      })
    },
    loadListForms ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          var url = '/o/rest/v2/registrations/' + data['registrationId'] + '/forms'
          var configs = {
            headers: {
              groupId: state.initData['groupId']
            }
          }
          axios.get(url, configs).then(function (response) {
            var serializable = response.data
            var arrFormnotRemmove = []
            if (serializable.data) {
              for (var i = 0; i < serializable.data.length; i++) {
                if (!serializable.data[i].removed) {
                  arrFormnotRemmove.push(serializable.data[i])
                }
              }
            }
            let registForms = arrFormnotRemmove
            resolve(registForms)
          }).catch(function (error) {
            console.log(error)
            reject(error)
          })
        })
      })
    }
  },
  mutations: {
    setLoading (state, payload) {
      state.loading = payload
    },
    setLoadingTable (state, payload) {
      state.loadingTable = payload
    },
    setLoadingSubmit (state, payload) {
      state.loadingSubmit = payload
    },
    setError (state, payload) {
      state.error = payload
    },
    setInitData (state, payload) {
      state.initData = payload
    },
    clearError (state) {
      state.error = null
    },
    setDocTypes (state, payload) {
      state.docTypes = payload
    },
    setRoleFilterStatus (state, payload) {
      state.roleFilterStatus = payload
    },
    setCssxModel (state, payload) {
      state.cssxModel = payload
    },
    setThongTinChung (state, payload) {
      window.sessionStorage.setItem('thongTinChung', JSON.stringify(payload))
      state.thongTinChung = payload
    },
    setHistory (state, payload) {
      window.sessionStorage.setItem('history', JSON.stringify(payload))
      state.history = payload
    },
    setTrackChanges (state, payload) {
      window.sessionStorage.setItem('trackChanges', JSON.stringify(payload))
      state.trackChanges = payload
    },
    setThongTinXuong (state, payload) {
      window.sessionStorage.setItem('thongTinXuong', JSON.stringify(payload))
      state.thongTinXuong = payload
    },
    setThongTinDoanhNghiep (state, payload) {
      window.sessionStorage.setItem('thongTinDoanhNghiep', JSON.stringify(payload))
      state.thongTinDoanhNghiep = payload
    }
  },
  getters: {
    initData (state) {
      return state.initData
    },
    loading (state) {
      return state.loading
    },
    cssxModel (state) {
      return state.cssxModel
    },
    trackChanges (state) {
      let trackChanges = state.trackChanges
      if (!trackChanges || (Object.keys(trackChanges).length === 0 && trackChanges.constructor === Object)) {
        let item = window.sessionStorage.getItem('trackChanges') || '{}'
        if (item && item !== 'undefined') {
          return JSON.parse(item) || {}
        }
        return {}
      } else {
        return trackChanges
      }
    },
    history (state) {
      let history = state.history
      if (!history || (Object.keys(history).length === 0 && history.constructor === Object)) {
        let item = window.sessionStorage.getItem('history') || '{}'
        console.log('history===========', item)
        if (item && item !== 'undefined') {
          return JSON.parse(item) || {}
        }
        return {}
      } else {
        return history
      }
    },
    thongTinChung (state) {
      let thongTinChung = state.thongTinChung
      if (!thongTinChung || (Object.keys(thongTinChung).length === 0 && thongTinChung.constructor === Object)) {
        let item = window.sessionStorage.getItem('thongTinChung') || '{}'
        if (item && item !== 'undefined') {
          return JSON.parse(item) || {}
        }
        return {}
      } else {
        return thongTinChung
      }
    },
    thongTinXuong (state) {
      let thongTinXuong = state.thongTinXuong
      if (!thongTinXuong || (Object.keys(thongTinXuong).length === 0 && thongTinXuong.constructor === Object)) {
        let item = window.sessionStorage.getItem('thongTinXuong') || '{}'
        return JSON.parse(item) || {}
      } else {
        return thongTinXuong
      }
    },
    thongTinDoanhNghiep (state) {
      let thongTinDoanhNghiep = state.thongTinDoanhNghiep
      if (!thongTinDoanhNghiep || (Object.keys(thongTinDoanhNghiep).length === 0 && thongTinDoanhNghiep.constructor === Object)) {
        let item = window.sessionStorage.getItem('thongTinXuong') || '{}'
        return JSON.parse(item) || {}
      } else {
        return thongTinDoanhNghiep
      }
    },
    loadingInitData (state) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          resolve(result)
        })
      })
    }
  }
})
