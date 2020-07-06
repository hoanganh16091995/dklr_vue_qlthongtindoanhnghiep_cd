<template>
  <div style="background: #ffff;">
    <div class="ml-0">
      <div class="row-header">
        <div class="background-triangle-big"> Thông tin chung doanh nghiệp</div>
        <div class="layout row wrap header_tools row-blue">
          <div class="flex xs6 pr-3 pt-2 pl-4" style="margin-left: auto;">
            <label class="bold" style="color: red;">{{thongTinChung['applicantStatus'] | filterStatus}}</label>
          </div>
          <div class="flex xs6 text-right pr-3" style="margin-left: auto;">
            <v-btn flat class=" my-0 py-0 btn-border-left" :disabled="disabledStatus" color="grey darken-1" v-on:click.native="saveThongTinChung(0)">
              <v-icon class="mr-2">save</v-icon>
              Lưu nháp
            </v-btn>

            <v-btn flat class=" my-0 py-0 btn-border-left" :disabled="disabledStatus" color="grey darken-1" v-on:click.native="saveThongTinChungAndNext(0)">
              <v-icon class="mr-2">send</v-icon>
              Lưu và tiếp tục
            </v-btn>

            <v-btn flat class=" my-0 py-0 btn-border-left" color="grey darken-1" v-on:click.native="quayLai()">
              <v-icon class="mr-2">undo</v-icon>
              Quay lại
            </v-btn>

          </div>

        </div>

      </div>
      <v-layout row wrap class="pt-2 ml-0">
        <input type="hidden" name="registrationId" id="registrationId" :value="id">
        <input type="hidden" name="referenceUid" id="referenceUid" :value="thongTinChung['referenceUid']">
        <v-flex xs12 sm12 class="py-2">
          <thong-tin-doanh-nghiep-form ref="thongTinDoanhNghiep" class="px-2" :thongTinDoanhNghiep="thongTinChung" :disabledForm="false" :thongTinChungPrev="thongTinChungPrev"></thong-tin-doanh-nghiep-form>
        </v-flex>
        <v-flex xs12 sm12 class="text-xs-right">
          <v-btn color="primary" :disabled="disabledStatus" @click="saveThongTinChung(0)"><v-icon>save</v-icon>&nbsp; Lưu nháp</v-btn>
          <v-btn color="primary" :disabled="disabledStatus" @click="saveThongTinChungAndNext(0)"><v-icon>send</v-icon>&nbsp; Lưu và tiếp tục</v-btn>
          <!-- <v-btn color="primary" @click="saveThongTinChung(1)"><v-icon>send</v-icon>&nbsp; Gửi</v-btn> -->
        </v-flex>
      </v-layout>
    </div>
  </div>
</template>

<script>
// import supportData from '../store/support_data.json'
// import $ from 'jquery'
import toastr from 'toastr'
import ThongTinDoanhNghiepForm from '@/components/dklr/thong_tin_doanh_nghiep_form.vue'
toastr.options = {
  'closeButton': true,
  'timeOut': '3000'
}
export default {
  props: ['id'],
  components: {
    'thong-tin-doanh-nghiep-form': ThongTinDoanhNghiepForm
  },
  data: () => ({
    loading: false,
    loadHomeDataTable: {},
    headers: [],
    payment: false,
    formTTDN: {},
    thongTinXuong: {},
    thongTinDoanhNghiep: {},
    listXuongItems: [],
    listRegistrationTemplate: [],
    thongTinChungPrev: {},
    indexSelect: -1
  }),
  computed: {
    disabledStatus () {
      if (!this.thongTinChung['applicantStatus'] || this.thongTinChung['applicantStatus'] === '0' || this.thongTinChung['applicantStatus'] === 3 || this.thongTinChung['applicantStatus'] === '3') {
        return false
      } else {
        return true
      }
    },
    thongTinChung () {
      /* eslint-disable */
      let item = this.$store.getters.thongTinChung || {}
      console.log('return thongTinChung', item)
      return item
      /* eslint-disable */
    },
    trackChanges () {
      /* eslint-disable */
      let item = this.$store.getters.trackChanges || {}
      console.log('return trackChanges', item)
      if (item['previousContentFileEntryId']) {
        let prevContents = JSON.parse(item['previousContentFileEntryId']) || {}
        this.thongTinChungPrev = prevContents['vr_ApplicantProfile']
      }
      return item
      /* eslint-disable */
    }
  },
  beforeCreate () {
    var vm = this
    vm.$nextTick(function () {
    })
  },
  created () {
    let vm = this
    vm.$nextTick(function () {
      vm.loadThongTinChung()
      if (!vm.id || vm.id === '0') {
        vm.mapThongTinChungToForm()
      } else {
        vm.loadTrackChange()
        vm.loaddDSNhaXuong()
      }
    })
  },
  watch: {
    '$route': function (newRoute, oldRoute) {
      // let vm = this
      // let query = newRoute.query
    }
  },
  methods: {
    loadThongTinChung () {
      let vm = this
      if (!vm.id || vm.id === '0') {
        console.log('not id to load thong tin xuong+++++++')
        return
      }
      vm.$store.dispatch('getThongTinChung', {
        applicantCode: vm.id
      }).then(result => {
        if (!result || !result['id']) {
          vm.mapThongTinChungToForm()
        }
        if (vm.$refs.thongTinDoanhNghiep && result['productionPlantMetadata']) {
          vm.$refs.thongTinDoanhNghiep['dataNguoiDaiDienItems'] = JSON.parse(result['productionPlantMetadata']) || []
        }
      }).catch(xhr => {
        vm.mapThongTinChungToForm()
      })
    },
    loadTrackChange () {
      let vm = this
      vm.$store.dispatch('loadTrackChange', {
        applicantCode: vm.id
      }).then(result => {
      }).catch(xhr => {
      })
    },
    loaddDSNhaXuong () {
      let vm = this
      vm.$store.dispatch('getDsNhaXuong', {
        applicantprofileid: vm.thongTinChung['id'],
        mtCore: 1
      }).then(result => {
        vm.listXuongItems = result['data']
      }).catch(xhr => {
      })
    },
    mapThongTinChungToForm () {
      let vm = this
      return new Promise((resolve, reject) => {
        vm.$store.dispatch('loadInitResource').then(function (result) {
          vm.loading = false
          vm.thongTinChung = Object.assign(vm.thongTinChung, {
            applicantName: result.applicant['applicantName'],
            applicantIdType: result.applicant['applicantIdType'],
            applicantIdNo: result.applicant['applicantIdNo'],
            applicantCode: result.applicant['applicantIdNo'],
            applicantIdDate: result.applicant['applicantIdDate'],
            applicantAddress: result.applicant['address'],
            applicantCityCode: result.applicant['cityCode'],
            applicantDistrictCode: result.applicant['districtCode'],
            applicantWardCode: result.applicant['wardCode'],
            contactName: result.applicant['contactName'],
            applicantPhone: result.applicant['contactTelNo'],
            applicantEmail: result.applicant['contactEmail'],
            govAgencyCode: result.applicant['govAgencyCode'],
            representativeEnterprise: result.applicant['representativeEnterprise']
          })
          resolve(vm.thongTinChung)
        }).catch(xhr => {
          vm.loading = false
          reject(xhr)
        })
      })
    },
    saveThongTinChungAndNext (state) {
      let vm = this
      vm.saveThongTinChung(state)
      if (!vm.listXuongItems || !vm.listXuongItems['length']) {
        vm.$router.push({
          path: '/thong-tin-xuong/0'
        })
      } else {
        vm.$router.push({
          path: '/thong-tin-xuong'
        })
      }
    },
    async saveThongTinChung (state) {
      let vm = this
      // if (!vm.id || vm.id === '0') {
      //   await vm.mapThongTinChungToForm(vm)
      // }
      vm.thongTinChung['mtCore'] = 1
      return new Promise((resolve, reject) => {
        if (vm.$refs.thongTinDoanhNghiep) {
          let dataNguoiDaiDienItems = vm.$refs.thongTinDoanhNghiep['dataNguoiDaiDienItems'] || []
          this.thongTinChung['productionPlantMetadata'] = JSON.stringify(dataNguoiDaiDienItems)
        }
        this.thongTinChung['applicantStatus'] = state || 0
        let query = {
          'indice' : 'vr_ApplicantProfile',
          'postStatus': 'draft',
          'body' : {
            'vr_ApplicantProfile': vm.thongTinChung
          }
        }
        if (state === 1 || state === '1') {
          query['body']['vr_ProductionPlant'] = vm.listXuongItems
          query['postStatus'] = 'send'
        }
        vm.$store.dispatch('saveThongTin', query).then(result => {
          vm.$store.commit('setThongTinChung', result['data']['vr_ApplicantProfile'] || result['data'])
          if (!vm.id || vm.id === '0') {
            toastr.success('Thêm mới thành công!')
            vm.$router.push({
              path: '/thong-tin-chung/' + result['applicantCode']
            })
          } else {
            toastr.success('Lưu thành công!')
          }
        }).catch(xhr => {
          toastr.error('xử lý thất bại, vui lòng thử lại!')
        })
      })
    },
    addThongTinXuong () {
      this.$router.push('/thong-tin-xuong/0')
    },
    toDetailThongTinXuong (state) {
      let vm = this
      vm.$store.commit('setThongTinXuong', vm.thongTinXuong)
      vm.$router.push({
        path: '/thong-tin-xuong/' + vm.thongTinXuong['formNo'],
        query: {
          state: state
        }
      })
    },
    quayLai () {
      window.history.back()
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
    },
    filterStatus (val) {
      if (val === 1 || val === '1') {
        return 'Chờ duyệt'
      } else if (val === 2 || val === '2') {
        return 'Đã duyệt'
      } else if (val === 3 || val === '3') {
        return 'Yêu cầu bổ sung'
      }
      return 'Chưa xác nhận'
    }
  }
}
</script>
