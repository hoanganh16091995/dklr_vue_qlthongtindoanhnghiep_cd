<template>
  <div style="background: #ffff;">
    <v-layout row wrap class="ml-0">
      <div class="row-header">
        <div class="background-triangle-big"> Thông tin xưởng</div>
        <div class="layout row wrap header_tools row-blue">

          <div class="flex xs12 text-right pr-3" style="margin-left: auto;">
            
            <v-btn flat class=" my-0 py-0 btn-border-left" color="grey darken-1" v-on:click.native="saveThongTinXuong()">
              <v-icon class="mr-2">save</v-icon>
              Ghi lại
            </v-btn>

            <v-btn flat class=" my-0 py-0 btn-border-left" color="grey darken-1" v-on:click.native="quayLai()">
              <v-icon class="mr-2">save</v-icon>
              Bỏ qua
            </v-btn>

            <v-btn flat class=" my-0 py-0 btn-border-left" color="grey darken-1" v-on:click.native="quayLai()">
              <v-icon class="mr-2">undo</v-icon>
              Quay lại
            </v-btn>

          </div>

        </div>

      </div>
      <input type="hidden" name="registrationId" id="registrationId" :value="thongTinChung['registrationId']">
      <input type="hidden" name="referenceUid" id="referenceUid" :value="thongTinXuong['referenceUid']">

      <v-flex xs12 sm12 class="py-2">
        <thong-tin-xuong-form class="px-2" ref="thongTinXuong" :thongTinXuong="thongTinXuong" :thongTinXuongPev="thongTinXuongPev" :disabledForm="false"></thong-tin-xuong-form>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
// import supportData from '../store/support_data.json'
import ThongTinXuongForm from '@/components/dklr/thong_tin_xuong_form.vue'
import toastr from 'toastr'
toastr.options = {
  'closeButton': true,
  'timeOut': '3000'
}
export default {
  props: ['id'],
  components: {
    'thong-tin-xuong-form': ThongTinXuongForm
  },
  data: () => ({
    loading: false,
    loadHomeDataTable: {},
    formTTDN: {},
    stateView: '',
    thongTinXuong: {},
    listRegistrationTemplate: [],
    thongTinXuongPev: {}
  }),
  beforeCreate () {
    var vm = this
    vm.$nextTick(function () {
    })
  },
  created () {
    var vm = this
    vm.$nextTick(function () {
      if (vm.id && vm.id !== '0') {
        vm.loadThongTinXuong()
      }
    })
  },
  mounted () {
    // var vm = this
    // if (vm.id && vm.id !== '0') {
    //   vm.loadForm()
    // } else {
    //   vm.loadRegistrationtemplateThongTinXuong().then(result => {
    //     console.log('result++++FORM+++++', result)
    //     vm.addRegistrationForm(result[0])
    //   })
    // }
  },
  computed: {
    thongTinChung () {
      /* eslint-disable */
      let item = this.$store.getters.thongTinChung || {}
      console.log('return item', item)
       return item
      /* eslint-disable */
    },
    trackChanges () {
      let vm = this
      /* eslint-disable */
      let item = vm.$store.getters.trackChanges || {}
      console.log('return trackChanges', item)
      if (item['previousContentFileEntryId']) {
        let prevContents = JSON.parse(item['previousContentFileEntryId']) || {}
        let listXuong = prevContents['vr_ProductionPlant'] || []
        if (listXuong && listXuong['length']) {
          vm.thongTinXuongPev = listXuong.find(item => {
            return vm.id === item['productionPlantCode']
          }) || {}
        }
      }
      return item
      /* eslint-disable */
    }
    // thongTinXuong () {
    //   return this.$store.getters.thongTinXuong || {}
    // }
  },
  watch: {
    '$route': function (newRoute, oldRoute) {
      // let vm = this
      // let query = newRoute.query
    }
  },
  methods: {
    saveThongTinXuong () {
      let vm = this
      if (!vm.thongTinChung || (Object.keys(vm.thongTinChung).length === 0 && vm.thongTinChung.constructor === Object)) {
        console.log('not thongTinChung+++++++', vm.thongTinChung)
        return
      }
      if (vm.$refs.thongTinXuong) {
        let dataNguoiDaiDienItems = vm.$refs.thongTinXuong['dataNguoiDaiDienItems'] || []
        this.thongTinXuong['productionPlantMetadata'] = JSON.stringify(dataNguoiDaiDienItems)
      }
      vm.thongTinXuong['applicantProfileId'] = vm.thongTinChung['applicantProfileId'] || vm.thongTinChung['id']
      let query = {
        'indice' : 'vr_ApplicantProfile',
        'postStatus': 'draft',
        'body' : {
          'vr_ProductionPlant': [
            vm.thongTinXuong
          ]
        }
      }
      vm.thongTinXuong['mtCore'] = 1
      vm.$store.dispatch('saveThongTin', query).then(result => {
        // vm.$store.commit('setThongTinXuong', result)
        // vm.loadForm()
        vm.thongTinXuong = result
        if (!vm.id || vm.id === '0') {
          toastr.success('Thêm mới thành công!')
          vm.$router.push({
            path: '/thong-tin-xuong/' + result['productionPlantCode']
          })
        } else {
          toastr.success('Lưu thành công!')
        }
      }).catch(xhr => {
        toastr.error('xử lý thất bại, vui lòng thử lại!')
      })
    },
    loadRegistrationtemplateThongTinXuong () {
      let vm = this
      return new Promise((resolve, reject) => {
        if (!vm.listRegistrationTemplate.length) {
          vm.$store.dispatch('loadRegistrationTemplate', {}).then(result => {
            let arrRes = []
            if (result.data) {
              for (var i = 0; i < result.data['length']; i++) {
                if (result.data[i].multiple) {
                  arrRes.push(result.data[i])
                }
              }
            }
            vm.listRegistrationTemplate = arrRes
            console.log('arrRes===============>>>>', arrRes)
            resolve(arrRes)
          }).catch(xhr => {
            vm.listRegistrationTemplate = []
            reject(xhr)
          })
        } else {
          resolve(vm.listRegistrationTemplate)
        }
      })
    },
    loadThongTinXuong () {
      let vm = this
      if (!vm.id || vm.id === '0') {
        console.log('not id to load thong tin xuong+++++++', vm.thongTinChung)
        return
      }
      vm.$store.dispatch('getThongTinXuong', {
        productionPlantCode: vm.id
      }).then(result => {
        vm.thongTinXuong = result || {}
        if (vm.$refs.thongTinXuong && result['productionPlantMetadata']) {
          vm.$refs.thongTinXuong['dataNguoiDaiDienItems'] = JSON.parse(result['productionPlantMetadata']) || []
        }
      }).catch(xhr => {
      })
    },
    // saveForm () {
    //   let vm = this
    //   if (!vm.thongTinChung || (Object.keys(vm.thongTinChung).length === 0 && vm.thongTinChung.constructor === Object)) {
    //     console.log('not thongTinChung+++++++', vm.thongTinChung)
    //     return
    //   }
    //   if (!vm.thongTinXuong || (Object.keys(vm.thongTinXuong).length === 0 && vm.thongTinXuong.constructor === Object)) {
    //     console.log('not thongTinXuong+++++++', vm.thongTinXuong)
    //     return
    //   }
    //   var formType = $('#formPartNo' + vm.thongTinXuong['referenceUid'] + ' .formType').val()
    //   var value = ''
    //   value = window.$('#formPartNo' + vm.thongTinXuong['formNo']).alpaca('get').getValue();
    //   var errorMessage = '';
    //   $('#formPartNo' + vm.thongTinXuong['referenceUid'] + ' div[class*="has-error"] > label').each(function (index) {
    //     errorMessage = 'notValid'
    //   })
    //   if (errorMessage === '' && vm.thongTinXuong['referenceUid']) {
    //     vm.$store.dispatch('saveForm', {
    //       registrationId: vm.thongTinChung['registrationId'],
    //       referenceUid: vm.thongTinXuong['referenceUid'],
    //       value: value
    //     }).then(result => {
    //       toastr.success('Lưu thông tin thành công!')
    //     }).catch(xhr => {
    //       toastr.error('Lưu thất bại, vui lòng thử lại!')
    //       console.log('save form error =====================>>>>', xhr)
    //     })
    //   }
    // },
    toDetail (index, item) {
      let status = item.requestState
      if (this.type === 'thu_tuc') {
        status = item.documentStatusCode
      }
      this.$router.push('/ho-so/' + this.type + '/' + item.documentName + '/' + item.documentYear + '/' + item.documentTypeCode + '/' + status)
    },
    quayLai () {
      // window.history.back()
      this.$router.push({
        path: '/thong-tin-xuong'
      })
    }
  },
  filters: {
    money (value) {
      if (value) {
        var moneyCur = (value / 1).toFixed(0).replace('.', ',')
        return moneyCur.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' VNĐ'
      } else {
        return ''
      }
    }
  }
}
</script>
