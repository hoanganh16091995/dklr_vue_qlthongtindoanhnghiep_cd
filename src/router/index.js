import Vue from 'vue'
import Router from 'vue-router'
import HomeDataTable from '@/components/Home_data_table.vue'
import ThongTinChung from '@/components/dklr/thong_tin_chung.vue'
import ThongTinXuong from '@/components/dklr/thong_tin_xuong.vue'
import ThongTinAll from '@/components/dklr/thong_tin_all.vue'
import Home from '@/components/Home.vue'

Vue.use(Router)
export default new Router({
  routes: [
    {
      path: '/',
      component: Home,
      children: [
        {
          path: '/thong-tin-xuong',
          component: HomeDataTable,
          props: true
        },
        {
          path: '/thong-tin-xuong/:id',
          component: ThongTinXuong,
          props: true
        },
        {
          path: '/thong-tin-chung/:id',
          component: ThongTinChung,
          props: true
        },
        {
          path: '/thong-tin-lich-su/:id',
          component: ThongTinAll,
          props: true
        }
      ],
      props: true
    }
  ]
})
