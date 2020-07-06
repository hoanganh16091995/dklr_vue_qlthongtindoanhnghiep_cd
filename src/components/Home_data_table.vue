<template>

  <div>
    <div style="background: #ffff;">
      <div class="row-header" style="height: 38px;overflow: hidden; background: rgb(236, 233, 233);">
            <div class="background-triangle-big view_tp_pdf"> {{titleTable}} </div>
            <div class="layout row wrap header_tools row-blue mr-2">

              <div class="flex text-right" style="margin-left: auto;">
                <v-btn flat class=" my-0 py-0 btn-border-left" color="grey darken-1" v-on:click.native="themMoiXuong()">
                  <v-icon class="mr-2">add</v-icon>
                  Thêm mới
                </v-btn>
                <span class="font-regulal" style="font-weight: bold;color: #2372bb;">  </span>
              </div>
          </div>
      </div>
      <v-flex>
        <content-placeholders v-if="loading">
          <content-placeholders-img />
          <content-placeholders-heading />
        </content-placeholders>
        <v-data-table
          v-if="!loading"
          :headers="headersNhaXuong"
          :items="dataNhaXuongItems"
          class="table-bordered danhSachHoSoTable__class"
          hide-actions
          :no-data-text="'Không tìm thấy dữ liệu'"
          :no-results-text="'Không tìm thấy dữ liệu'"
        >
          <template slot="headers" slot-scope="props">
            <th v-for="header in props.headers" class="text-xs-center" v-html="header['text']">
              
            </th>
          </template>
          <template slot="items" slot-scope="props">
            <tr>
              <td class="text-xs-center" style="width: 5%;">
                {{ pageNhaXuong * 15 - 15 + props.index + 1 }}
              </td>
              <td class="text-xs-center">
                <span style="cursor: pointer;" @click.prevent.stop="toDetailNhaXuong(props.item)">{{ props.item['productionPlantCode']}}</span>
              </td>
              <td class="text-xs-center">
                <span @click.prevent.stop="toDetailNhaXuong(props.item)" style="cursor: pointer;">{{ props.item['productionPlantName'] }}</span>  <br/>
              </td>
              <td class="text-xs-center">
                <span @click.prevent.stop="toDetailNhaXuong(props.item)" style="cursor: pointer;">{{ props.item['productionPlantAddress'] }}</span>  <br/>
              </td>
              <td class="text-xs-center">
                <span>{{ props.item['productionPlantEmail'] }}</span>
              </td>
              <td class="text-xs-center">
                <span>{{ props.item['productionPlantContactPhone'] }}</span> <br>
              </td>
              <td class="text-xs-center">
                <a href="javascript:;" style="color: blue;" @click="deleteXuong(props.item, props.index)">Xóa</a>
              </td>
            </tr>
          </template>

        </v-data-table>
      </v-flex>
      
      <v-dialog v-model="popUpNhaXuong" persistent max-width="900px">
        <v-card>
          <v-toolbar dark color="primary" height="43">
            <div class="text-bold">Thông tin nhà xưởng</div>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn icon dark @click.native="popUpNhaXuong = false">
                <v-icon>close</v-icon>
              </v-btn>
            </v-toolbar-items>
          </v-toolbar>
          <v-card-text class="pb-0">
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm12>
                  
                </v-flex>
                <v-flex xs12 sm12 class="text-xs-right">
                  <v-btn small color="primary" @click="changeThongTinTaiDoanhNghiep()">Lưu lại</v-btn>
                  <v-btn small @click="popUpNhaXuong = !popUpNhaXuong">Thoát</v-btn>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
        </v-card>
      </v-dialog>
    </div>
    <div class="text-xs-right layout wrap" style="position: relative;">
      <div class="flex pagging-table px-2"> 
        <tiny-pagination :total="totalNhaXuong" :page="pageNhaXuong" custom-class="custom-tiny-class" 
        @tiny:change-page="paggingNhaXuong" ></tiny-pagination> 
      </div>
    </div>
  </div>
</template>

<script>
import supportData from '../store/support_data.json'
import FilterAdv from './dklr/hanghai_filter_adv.vue'
import TinyPagination from './dklr/hanghai_pagination.vue'
// import $ from 'jquery'
import toastr from 'toastr'
toastr.options = {
  'closeButton': true,
  'timeOut': '3000'
}
export default {
  props: ['type'],
  components: {
    'tiny-pagination': TinyPagination,
    'jx-hanghai-filter-adv': FilterAdv
  },
  computed: {
    thongTinChung () {
      /* eslint-disable */
      let item = this.$store.getters.thongTinChung || {}
      console.log('return item', item)
      return item
      /* eslint-disable */
    }
  },
  data: () => ({
    rules: {
      required: (value) => !!value || 'Trường yêu cầu bắt buộc.',
      email: (value) => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return pattern.test(value) || 'Email không hợp lệ.'
      }
    },
    checkboxDoiEmail: true,
    checkboxDoiMatKhau: true,
    ttdnDetail: {
      passNewCitizen: '',
      emailNewCitizen: '',
      userId: 0
    },
    showSearchAvd: false,
    showLyDo: false,
    stateChangePassCitizen: false,
    popUpNhaXuong: false,
    STATE_LUU_NHAP: 0,
    STATE_CHO_DUYET: 1,
    STATE_DA_DUYET: 2,
    STATE_CHO_BO_SUNG: 3,
    loadingDetail: false,
    loadingBtn: false,
    titleTable: 'Danh sách nhà xưởng',
    total: 100,
    countItemSelect: 30,
    countItemRest: 70,
    loading: false,
    supportData: supportData,
    loadHomeDataTable: {},
    headers: [],
    payment: false,
    dataNhaXuongItems: [
    ],
    filterState: {},
    totalNhaXuong: 0,
    pageNhaXuong: 1,
    headersNhaXuong: [],
    paymentTypeData: {},
    paymentMarkDelete: {},
    loaiHinhCSSXItems: [],
    cssxChaItems: []
  }),
  beforeCreate () {
    var vm = this
    vm.$nextTick(function () {
      vm.headersNhaXuong = supportData.headersThongTinXuong
    })
  },
  created () {
    var vm = this
    vm.$nextTick(function () {
      let query = vm.$router.history.current.query
      if (query && query.hasOwnProperty('page') && query['page'] !== 1) {
        vm.pageNhaXuong = parseInt(query['page']) || 1
      } else {
        vm.pageNhaXuong = 1
      }
      console.log('vm.filterState+++++++', vm.filterState)
      let param = null
      param = {
        start: vm.pageNhaXuong * 15 - 15,
        end: vm.pageNhaXuong * 15
      }
      if (query) {
        for (var key in query) {
          if (key !== 'page') {
            param[key] = query[key]
          }
        }
      }
      vm.loading = true
      vm.getDataListNhaXuong(param)
    })
  },
  watch: {
    '$route': function (newRoute, oldRoute) {
      let vm = this
      let query = newRoute.query
      if (query && query.hasOwnProperty('page') && query['page']) {
        vm.pageNhaXuong = parseInt(query['page']) || 1
      } else {
        vm.pageNhaXuong = 1
      }
      let param = null
      param = {
        start: vm.pageNhaXuong * 15 - 15,
        end: vm.pageNhaXuong * 15
      }
      for (var key in query) {
        if (key !== 'page') {
          param[key] = query[key]
        }
      }
      vm.loading = true
      console.log('param++++++table+++++++', param)
      vm.getDataListNhaXuong(param)
    }
  },
  methods: {
    themMoiXuong () {
      let vm = this
      vm.$router.push({
        path: '/thong-tin-xuong/0'
      })
    },
    getDataListNhaXuong: function (param) {
      let vm = this
      if (!param) {
        param = {}
      }
      param['applicantprofileid'] = vm.thongTinChung['id']
      if (!vm.thongTinChung['id']) {
        console.log('NOT applicantProfileId TO LOAD LIST')
        vm.loading = false
        return
      }
      vm.loading = true
      vm.$store.dispatch('getDsNhaXuong', param).then(function (result) {
        vm.dataNhaXuongItems = result['data']
        vm.totalNhaXuong = result['total']
        vm.loading = false
      }).catch(xhr => {
        vm.totalNhaXuong = 0
        vm.loading = false
      })
    },
    filterADV: function (param) {
      console.log('param++++++++', param)
      let vm = this
      vm.filterState = param
      if (!param) {
        param = {}
      }
      vm.$router.push({
        path: '/thong-tin-doanh-nghiep/' + vm.type + '/' + vm.code,
        query: {
          ...param
        }
      })
    },
    deleteXuong: function (item, index) {
      let vm = this
      let cf = confirm('Bạn có thực sự muốn xóa!')
      if (cf) {
        vm.$store.dispatch('deleteXuong', {
          id: item['id']
        }).then(result => {
          vm.dataNhaXuongItems.splice(index, 1)
          toastr.success('Xóa thành công!')
        }).catch(xhr => {
          toastr.error('Xóa thất bại, vui lòng thử lại!')
        })
      }
    },
    toDetailNhaXuong: function (item) {
      let vm = this
      vm.$store.commit('setThongTinXuong', item)
      vm.$router.push({
        path: '/thong-tin-xuong/' + item['productionPlantCode']
      })
    },
    paggingNhaXuong (config) {
      let vm = this
      let current = vm.$router.history.current
      let newQuery = current.query
      let queryString = '?'
      newQuery['page'] = ''
      for (let key in newQuery) {
        if (newQuery[key] !== '' && newQuery[key] !== 'undefined' && newQuery[key] !== undefined) {
          queryString += key + '=' + newQuery[key] + '&'
        }
      }
      queryString += 'page=' + config.page
      vm.$router.push({
        path: current.path + queryString
      })
    }
  },
  filters: {
    maXuong (value) {
      if (!value) {
        return
      }
      return value.substring(value.length - 12, value.length)
    },
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
