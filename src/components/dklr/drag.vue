// mounted () {
  //   var vm = this
  //   // Xử lý ban đầu trong mount là do có hàm load form cần truy cập tới DOM
  //   vm.$nextTick(function () {
  //     vm.thongTinChung['registrationState'] = 1
  //     if (!vm.id || vm.id === '0') {
  //       // Khởi tạo dữ liệu ban đầu (các dữ liệu lấy từ applicant) cho registration trc khi thêm mới
  //       // Khi thêm mới cần phải thêm vào 2 bảng Registration và Registration Form
  //       vm.mapThongTinChungToForm().then(result => {
  //         // Thêm mới registration
  //         vm.addRegistration().then(resultRegistration => {
  //           // Lấy ds thông tin doanh nghiệp
  //           // Form của thông tin doanh nghiệp có formNo là TTCDN
  //           vm.loadDsXuong().then(resultDsXuong => {
  //             // Nếu không tìm thấy tin doanh nghiệp nào thì lấy thông tin doanh nghiệp từ ds Registration Template rồi đổ vào Registration Form
  //             if (!resultDsXuong || (Array.isArray(resultDsXuong) && !resultDsXuong.length)) {
  //               // Lấy ds Registrtion Template
  //               vm.loadRegistrationtemplate().then(resultTemplate => {
  //                 // Check có dữ liệu thì gọi hàm add Registration Form (Bản chất là lấy thông tin doanh nghiệp từ Registration Template add vào Registration Form )
  //                 if (resultTemplate && Array.isArray(resultTemplate) && resultTemplate.length) {
  //                   vm.addRegistrationForm(resultTemplate[0]).then(resultForm => {
  //                     // Sau khi add form thành công thì load form lên để hiển thị 
  //                     // Vì form này là thêm mới nên truyền thêm key addNew vào để build sẵn dữ liệu từ applicant vào form
  //                     vm.loadForm({
  //                       addNew: true
  //                     })
  //                   })
  //                 }
  //               })
  //             // Trường hợp tìm thấy thông tin doanh nghiệp trong Registration Form thì hiển thi ra thông tin
  //             } else {
  //               for (var i = 0; i < resultDsXuong.length; i++) {
  //                 if (resultDsXuong[i] && resultDsXuong[i]['formNo'] === 'TTCDN') {
  //                   vm.thongTinDoanhNghiep = resultDsXuong[i]
  //                   vm.$store.commit('setThongTinDoanhNghiep', resultDsXuong[i])
  //                   vm.loadForm()
  //                   break
  //                 }
  //               }
  //             }
  //           })
  //         })
  //       })
  //     } else {
  //       vm.loadDsXuong().then(resultDsXuong => {
  //         if (!resultDsXuong || (Array.isArray(resultDsXuong) && !resultDsXuong.length)) {
  //           vm.loadRegistrationtemplate().then(resultTemplate => {
  //             if (resultTemplate && Array.isArray(resultTemplate) && resultTemplate.length) {
  //               vm.addRegistrationForm(resultTemplate[0]).then(resultForm => {
  //                 vm.loadForm({
  //                   addNew: true
  //                 })
  //               })
  //             }
  //           })
  //         } else {
  //           for (var i = 0; i < resultDsXuong.length; i++) {
  //             if (resultDsXuong[i] && resultDsXuong[i]['formNo'] === 'TTCDN') {
  //               vm.thongTinDoanhNghiep = resultDsXuong[i]
  //               vm.$store.commit('setThongTinDoanhNghiep', resultDsXuong[i])
  //               vm.loadForm()
  //               break
  //             }
  //           }
  //         }
  //       })
  //     }
  //   })
  // },

  // id (val) {
    //   let vm = this
    //   if (val && val !== '0') {
    //     vm.loadDsXuong().then(resultDsXuong => {
    //       if (!resultDsXuong || (Array.isArray(resultDsXuong) && !resultDsXuong.length)) {
    //         vm.loadRegistrationtemplate().then(resultTemplate => {
    //           if (resultTemplate && Array.isArray(resultTemplate) && resultTemplate.length) {
    //             vm.addRegistrationForm(resultTemplate[0]).then(resultForm => {
    //               vm.loadForm({
    //                 addNew: true
    //               })
    //             })
    //           }
    //         })
    //       } else {
    //         for (var i = 0; i < resultDsXuong.length; i++) {
    //           if (resultDsXuong[i] && resultDsXuong[i]['formNo'] === 'TTCDN') {
    //             vm.thongTinDoanhNghiep = resultDsXuong[i]
    //             vm.$store.commit('setThongTinDoanhNghiep', resultDsXuong[i])
    //             vm.loadForm()
    //             break
    //           }
    //         }
    //       }
    //     })
    //   } else {
    //     vm.thongTinChung['registrationState'] = 1
    //     // Khởi tạo dữ liệu ban đầu (các dữ liệu lấy từ applicant) cho registration trc khi thêm mới
    //     // Khi thêm mới cần phải thêm vào 2 bảng Registration và Registration Form
    //     vm.mapThongTinChungToForm().then(result => {
    //       // Thêm mới registration
    //       vm.addRegistration().then(resultRegistration => {
    //         // Lấy ds thông tin doanh nghiệp
    //         // Form của thông tin doanh nghiệp có formNo là TTCDN
    //         vm.loadDsXuong().then(resultDsXuong => {
    //           // Nếu không tìm thấy tin doanh nghiệp nào thì lấy thông tin doanh nghiệp từ ds Registration Template rồi đổ vào Registration Form
    //           if (!resultDsXuong || (Array.isArray(resultDsXuong) && !resultDsXuong.length)) {
    //             // Lấy ds Registrtion Template
    //             vm.loadRegistrationtemplate().then(resultTemplate => {
    //               // Check có dữ liệu thì gọi hàm add Registration Form (Bản chất là lấy thông tin doanh nghiệp từ Registration Template add vào Registration Form )
    //               if (resultTemplate && Array.isArray(resultTemplate) && resultTemplate.length) {
    //                 vm.addRegistrationForm(resultTemplate[0]).then(resultForm => {
    //                   // Sau khi add form thành công thì load form lên để hiển thị 
    //                   // Vì form này là thêm mới nên truyền thêm key addNew vào để build sẵn dữ liệu từ applicant vào form
    //                   vm.loadForm({
    //                     addNew: true
    //                   })
    //                 })
    //               }
    //             })
    //           // Trường hợp tìm thấy thông tin doanh nghiệp trong Registration Form thì hiển thi ra thông tin
    //           } else {
    //             for (var i = 0; i < resultDsXuong.length; i++) {
    //               if (resultDsXuong[i] && resultDsXuong[i]['formNo'] === 'TTCDN') {
    //                 vm.thongTinDoanhNghiep = resultDsXuong[i]
    //                 vm.$store.commit('setThongTinDoanhNghiep', resultDsXuong[i])
    //                 vm.loadForm()
    //                 break
    //               }
    //             }
    //           }
    //         })
    //       })
    //     })
    //   }
    // },


    // addRegistrationForm (thongTinDoanhNghiep) {
    //   let vm = this
    //   return new Promise((resolve, reject) => {
    //     if (!vm.thongTinChung || (Object.keys(vm.thongTinChung).length === 0 && vm.thongTinChung.constructor === Object)) {
    //       console.log('not thongTinChung+++++++', vm.thongTinChung)
    //       return
    //     } else {
    //       reject({
    //         message: 'NOT FOUND FORM NO'
    //       })
    //     }
    //     let data = {
    //       registrationId: vm.thongTinChung['registrationId'],
    //       formNo: thongTinDoanhNghiep['formNo']
    //     }
    //     vm.$store.dispatch('addForm', data).then(result => {
    //       vm.$store.commit('setThongTinDoanhNghiep', result)
    //       resolve(result)
    //     }).catch(xhr => {
    //       reject(xhr)
    //     })
    //   })
    // },
    // loadRegistrationtemplate () {
    //   let vm = this
    //   return new Promise((resolve, reject) => {
    //     if (!vm.listRegistrationTemplate.length) {
    //       vm.$store.dispatch('loadRegistrationTemplate', {}).then(result => {
    //         let arrRes = []
    //         if (result.data) {
    //           for (var i = 0; i < result.data['length']; i++) {
    //             if (result.data[i].formNo === 'TTCDN') {
    //               arrRes.push(result.data[i])
    //             }
    //           }
    //         }
    //         vm.listRegistrationTemplate = arrRes
    //         resolve(arrRes)
    //       }).catch(xhr => {
    //         vm.listRegistrationTemplate = []
    //         reject(xhr)
    //       })
    //     } else {
    //       resolve(vm.listRegistrationTemplate)
    //     }
    //   })
    // },
    // fnMapFormTTCDNtoReg () {
    //   let vm = this
    //   vm.thongTinChung = Object.assign(vm.thongTinChung, {
    //     applicantName: $("#ten_doanh_nghiep").val(),
    //     applicantIdType: '',
    //     applicantIdNo: $("#ma_so_doanh_nghiep").val(),
    //     address: $("#dia_chi_chinh_doanh_nghiep").val(),
    //     contactName: $("#nguoi_dai_dien_doanh_nghiep").val(),
    //     contactTelNo: $("#so_dien_thoai_doanh_nghiep").val(),
    //     contactEmail: $("#email_doanh_nghiep").val(),
    //     cityCode__hidden: $("#tinh").val(),
    //     districtCode__hidden: $("#huyen").val(),
    //     wardCode__hidden: $("#xa").val()
    //   })
    // },


    // loadForm (param) {
    //   let vm = this
    //   if (!vm.thongTinChung || (Object.keys(vm.thongTinChung).length === 0 && vm.thongTinChung.constructor === Object)) {
    //     console.log('not thongTinChung+++++++', vm.thongTinChung)
    //     return
    //   }
    //   if (!vm.thongTinDoanhNghiep || (Object.keys(vm.thongTinDoanhNghiep).length === 0 && vm.thongTinDoanhNghiep.constructor === Object)) {
    //     console.log('not thongTinDoanhNghiep+++++++', vm.thongTinDoanhNghiep)
    //     return
    //   }
    //   let data = {
    //     registrationId: vm.thongTinChung['registrationId'],
    //     referenceUid: vm.thongTinDoanhNghiep['referenceUid'],
    //     formNo: vm.thongTinDoanhNghiep['formNo'],
    //     ...param
    //   }
    //   vm.$store.dispatch('showAlpacaJSFORMRegist', data).then(result => {
    //     console.log('resultForm==========>>>>>>>>', result)
    //   }).catch(xhr => {
    //     console.log('error load form=============>>>>', xhr)
    //   })
    // },
    // saveForm () {
    //   let vm = this
    //   if (!vm.thongTinChung || (Object.keys(vm.thongTinChung).length === 0 && vm.thongTinChung.constructor === Object)) {
    //     console.log('not thongTinChung+++++++', vm.thongTinChung)
    //     return
    //   }
    //   if (!vm.thongTinDoanhNghiep || (Object.keys(vm.thongTinDoanhNghiep).length === 0 && vm.thongTinDoanhNghiep.constructor === Object)) {
    //     console.log('not thongTinDoanhNghiep+++++++', vm.thongTinDoanhNghiep)
    //     return
    //   }
    //   return new Promise((resolve, reject) => {
    //     var formType = $('#formPartNo' + vm.thongTinDoanhNghiep['referenceUid'] + ' .formType').val()
    //     var value = ''
    //     value = window.$('#formPartNo' + vm.thongTinDoanhNghiep['formNo']).alpaca('get').getValue();
    //     var errorMessage = '';
    //     $('#formPartNo' + vm.thongTinDoanhNghiep['referenceUid'] + ' div[class*="has-error"] > label').each(function (index) {
    //       errorMessage = 'notValid'
    //     })
    //     if (errorMessage === '' && vm.thongTinDoanhNghiep['referenceUid']) {
    //       vm.$store.dispatch('saveForm', {
    //         registrationId: vm.thongTinChung['registrationId'],
    //         referenceUid: vm.thongTinDoanhNghiep['referenceUid'],
    //         value: value
    //       }).then(result => {
    //         resolve(result)
    //         toastr.success('Lưu thông tin thành công!')
    //       }).catch(xhr => {
    //         reject(xhr)
    //         toastr.error('Lưu thất bại, vui lòng thử lại!')
    //         console.log('save form error =====================>>>>', xhr)
    //       })
    //     }
    //   })
    // },