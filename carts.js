const apiUrl = 'https://vue3-course-api.hexschool.io';
const apiPath = 'koung-hexschool';

Object.keys(VeeValidateRules).forEach((rule) => {
  if (rule !== 'default') {
    VeeValidate.defineRule(rule, VeeValidateRules[rule])
  }
})
// 讀取外部的資源
VeeValidateI18n.loadLocaleFromURL('./zh_TW.json');

// Activate the locale
VeeValidate.configure({
  generateMessage: VeeValidateI18n.localize('zh_TW'),
  validateOnInput: true, // 調整為：輸入文字時，就立即進行驗證
});

const productModal = {
  props:['id','addToCart','openModal'],
    data(){
    return{
      modal: {},
      tempProduct: {},
      qty: 1
    };
  },
  template : '#userProductModal',
  watch:{
    id() {
      // console.log('productModal', this.id);
      if(this.id){
        axios.get(`${apiUrl}/v2/api/${apiPath}/product/${this.id}`)
        .then(res => {
        // console.log("單一產品:", res.data.product);
        this.tempProduct = res.data.product;
        this.modal.show()
      })
      }
      
    }
  },
  methods:{
    hide(){
      this.modal.hide();
    }
  },
  mounted(){
    this.modal = new bootstrap.Modal(this.$refs.modal);
    // 監聽 DOM，當 Modal 關閉...要做其他事情
    this.$refs.modal.addEventListener('hidden.bs.modal',(event) => { 
      // console.log("Modal被關閉了");
      this.openModal('');
    });
  },
}

const app = Vue.createApp({
  data(){
    return{
      products:[],
      productId: '',
      cart: {},
      loadingItem: '',
      form: {
        user: {
          name: '',
          email: '',
          tel: '',
          address: '',
        },
      },
      message: '',
      loadingStatus: {
        loadingItem: '',
      },

    }
  },
  methods: {
    getProducts(){
      axios.get(`${apiUrl}/v2/api/${apiPath}/products/all`)
      .then(res => {
        // console.log("產品列表:", res.data.products);
        this.products = res.data.products;
      })
    },
    openModal(id){
      this.productId = id;
      // console.log("外層帶入ID productId" ,id);
    },
    addToCart(product_id ,qty = 1){
      const data = {
        product_id,
        qty
      };
      axios.post(`${apiUrl}/v2/api/${apiPath}/cart`, {data})
      .then(res => {
        // console.log("加入購物車:", res.data);
        this.$refs.productModal.hide(); //加入購物車完後關閉
        this.getCarts();
      })
    },
    getCarts(){
      axios.get(`${apiUrl}/v2/api/${apiPath}/cart`)
      .then(res => {
        // console.log("購物車:", res.data);
        this.cart = res.data.data;
      })
    },
    updataCartItem(item){
      //購物車的id , 產品的id
      const data = {
        product_id: item.product.id, //展開選取項目
        qty: item.qty,
      };
      this.loadingItem = item.id;
      axios.put(`${apiUrl}/v2/api/${apiPath}/cart/${item.id}`,{data})
      .then(res => {
        // console.log("更新購物車:", res.data);
        this.getCarts();
        this.loadingItem = '';
      })
    },
    deleteItem(item){
      axios.delete(`${apiUrl}/v2/api/${apiPath}/cart/${item.id}`)
      .then(res => {
        // console.log("刪除購物車:", res.data);
        alert(res.data.message);
        this.getCarts();
      })
    },

    deleteAllCarts() {
      const url = `${apiUrl}/api/${apiPath}/carts`;
      axios.delete(url).then((res) => {
        alert(res.data.message);
        this.getCarts();
      }).catch((err) => {
        alert(err.res.data.message);
      });
    },

    removeCartItem(id) {
      const url = `${apiUrl}/api/${apiPath}/cart/${id}`;
      this.loadingStatus.loadingItem = id;
      axios.delete(url).then((res) => {
        alert(res.data.message);
        this.loadingStatus.loadingItem = '';
        this.getCarts();
      }).catch((err) => {
        alert(err.res.data.message);
      });
    },
    createOrder() {
      const url = `${apiUrl}/api/${apiPath}/order`;
      const order = this.form;
      axios.post(url, { data: order }).then((res) => {
        alert(res.data.message);
        this.$refs.form.resetForm();
        this.getCarts();
      }).catch((err) => {
        alert(err.res.data.message);
      });
    },
    
  },
  components:{
    productModal
  },

  mounted() {
    this.getProducts();
    this.getCarts();
  },
});

app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);
app.component('loading', VueLoading.Component)
app.mount('#app')
