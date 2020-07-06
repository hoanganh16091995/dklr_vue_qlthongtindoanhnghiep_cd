<template>
  <div style="width: 100%; position: relative; border-right: 1px solid #ccc; height: 100%;">
    
    <v-layout row wrap>
      <v-flex xs12 sm6>
        <v-btn @click="capNhatThongTin()" class="px-0 mx-0 py-0 mt-0 mb-1" color="primary" style="width: 100%;">Cập nhật</v-btn>
      </v-flex>
      <v-flex xs12 sm6 class="pl-2">
        <v-btn @click="guiThongTin()" :disabled="disabledStatus" class="px-0 mx-0 py-0 mt-0 mb-1" color="primary" style="width: 100%;">Gửi</v-btn>
      </v-flex>
    </v-layout>

    <div class="expansion-panel__header" data-ripple="false" style="background-color: #14bef0; color: #fff;     padding: 9px 9px 8px 9px;"><div>CHI TIẾT DOANH NGHIỆP</div>
      <div class="header__icon"></div>
    </div>
		<div class="flex xs12">
      <v-list>
        <v-list-tile
          :class='{"list--group__header--active": (activeIndex === "ThongTinChung")}'
          :key="'thong-tin-chung'"
          avatar
          @click="toThongTinChung()"
          >
          <v-list-tile-avatar>
            <i v-if="activeIndex === 'ThongTinChung'" style="font-size: 18px;" class="material-icons">
              play_arrow
            </i>
          </v-list-tile-avatar>

          <v-list-tile-content>
            <v-list-tile-title style="font-weight: 600">Thông tin chung</v-list-tile-title>
          </v-list-tile-content>

        </v-list-tile>
        
        <!-- :disabled="!thongTinChung['id']"
          :style="{'pointer-events': !thongTinChung['id'] ? 'none' : ''}" -->
        <v-list-tile
          :class='{"list--group__header--active": (activeIndex === "ThongTinXuong")}'
          :key="'thong-tin-xuong'"
          avatar
          @click="toThongTinXuong()"
          >
          <v-list-tile-avatar>
            <i v-if="activeIndex === 'ThongTinXuong'" style="font-size: 18px;" class="material-icons">
              play_arrow
            </i>
          </v-list-tile-avatar>

          <v-list-tile-content>
            <v-list-tile-title style="font-weight: 600">Thông tin xưởng ({{countNhaXuong}})</v-list-tile-title>
          </v-list-tile-content>

        </v-list-tile>
      </v-list>
    </div>
    <div class="expansion-panel__header" data-ripple="false" style="background-color: #14bef0; color: #fff;     padding: 9px 9px 8px 9px;" @click="loadHistory()"><div>LỊCH SỬ CẬP NHẬT</div>
      <div class="header__icon"></div>
    </div>
    <div style="width: 100%;" class="ml-3" v-if="loading">
      <content-placeholders>
        <content-placeholders-text :lines="4" />
      </content-placeholders>
    </div>
    <v-list two-line v-else style="height: 500px; overflow: auto;">
      <v-list-tile
        v-for="(item, index) in historyUpdates"
        :class='{"list--group__header--active": (activeIndex === item.id)}'
        :key="item['id']"
        avatar
        @click="toDetailHistory(item, index)"
        >
        <v-list-tile-avatar>
          <i class="fa fa-book fs20" aria-hidden="true"></i>
        </v-list-tile-avatar>

        <v-list-tile-content>
          <v-list-tile-title style="font-weight: 600">{{item['createdDate']}}</v-list-tile-title>
          <v-list-tile-sub-title></v-list-tile-sub-title>
        </v-list-tile-content>

      </v-list-tile>
    </v-list>
  </div>
</template>
<script>
// import axios from 'axios'
// import router from '@/router'
const COMPONENT_NAME = 'jx-hanghai-filter-left'
import toastr from 'toastr'
toastr.options = {
  'closeButton': true,
  'timeOut': '3000'
}
export default {
  name: COMPONENT_NAME,
  props: {
  },
  components: {
  },
  data () {
    return {
      STATE_LUU_NHAP: 0,
      STATE_CHO_DUYET: 1,
      STATE_DA_DUYET: 2,
      STATE_CHO_BO_SUNG: 3,
      indexSelect: -1,
      loading: false,
      initDataFilter: {},
      activeIndex: 0,
      historyUpdates: [],
      dataFilter: [],
      countNhaXuong: 0,
      listXuongItems: []
    }
  },
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
      console.log('return item', item)
      return item
      /* eslint-disable */
    }
  },
  created () {
    var vm = this
    let path = vm.$router.history.current.path
    console.log('patch,', path)
    if (path && path.indexOf('thong-tin-xuong') !== -1) {
      vm.activeIndex = 'ThongTinXuong'
    } else {
      vm.activeIndex = 'ThongTinChung'
    }
    vm.$nextTick(function () {
      vm.loading = true
      vm.$store.dispatch('loadInitResource').then(function (result) {
        vm.$store.dispatch('getThongTinChung', {
          applicantCode: result.applicant['applicantIdNo']
        }).then(result => {
          vm.countDSNhaXuong()
          vm.loaddDSNhaXuong()
        }).catch(xhr => {
        })
        vm.loadHistoryUpdate({
          applicantCode: result.applicant['applicantIdNo']
        })
      })
    })
  },
  watch: {
    '$route': function (newRoute, oldRoute) {
      this.countDSNhaXuong()
      this.loaddDSNhaXuong()
      // let vm = this
      // let query = newRoute.query
    }
  },
  methods: {
    countDSNhaXuong () {
      let vm = this
      vm.$store.dispatch('getDsNhaXuong', {
        applicantprofileid: vm.thongTinChung['id'],
        mtCore: 1
      }).then(result => {
        vm.countNhaXuong = result['total']
      }).catch(xhr => {
      })
    },
    guiThongTin () {
      let vm = this
      vm.saveThongTinChung(1)
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
    async saveThongTinChung (state) {
      let vm = this
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
    capNhatThongTin () {
      let vm = this
      vm.$store.commit('setThongTinChung', {})
      vm.$router.push({
        path: '/thong-tin-chung/' + 0
      })
    },
    toDetailHistory (item, index) {
      let vm = this
      vm.activeIndex = item['id']
      vm.$store.commit('setHistory', item)
      vm.$router.push({
        path: '/thong-tin-lich-su/' + item['id']
      })
    },
    toThongTinChung () {
      let vm = this
      vm.activeIndex = 'ThongTinChung'
      vm.$store.dispatch('loadInitResource').then(function (result) {
        vm.$store.dispatch('getThongTinChung', {
          applicantCode: result.applicant['applicantIdNo']
        }).then(resultApplicant => {
          setTimeout(function () {
            vm.$router.push({
              path: '/thong-tin-chung/' + resultApplicant['applicantCode'] || 0
            })
          }, 300)
        }).catch(xhr => {
          vm.$router.push({
            path: '/thong-tin-chung/0'
          })
        })
      })
    },
    toThongTinXuong () {
      let vm = this
      vm.activeIndex = 'ThongTinXuong'
      vm.$router.push({
        path: '/thong-tin-xuong'
      })
    },
    loadHistory () {
      let vm = this
      vm.loadHistoryUpdate({
        applicantCode: vm.thongTinChung['applicantCode']
      })
    },
    loadHistoryUpdate (params) {
      let vm = this
      vm.loading = true
      vm.$store.dispatch('loadHistoryUpdate', params).then(result => {
        vm.historyUpdates = result['data'] || []
        vm.loading = false
      }).catch(xhr => {
        vm.loading = false
      })
    }
  },
  filters: {
    parseDate (date) {
      if (!date) {
        return ''
      }
      return moment(String(date)).utc().format('DD/MM/YYYY HH:mm:ss')
    },
    registrationState (state) {
      let vm = this
      if (state === 0) {
        return 'Lưu nháp'
      } else if (state === 1) {
        return 'Chờ duyệt'
      } else if (state === 2) {
        return 'Đã duyệt'
      } else {
        return 'Yêu cầu bổ sung'
      }
    }
  }
}
</script>
