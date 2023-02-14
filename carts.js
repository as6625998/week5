const apiUrl = 'https://vue3-course-api.hexschool.io';
const apiPath = 'koung-hexschool';

const productModal = {
  data(){
    return{
      tempProduct: {}
    };
  },
  template : '#userProductModal',
  mounted(){
  this.modal = new bootstrap.Modal(this.$refs.modal);
  this.modal.show()
  },
}

const app = Vue.createApp({
  data(){
    return{
      products:[]
    }
  },
  methods: {
    getProducts(){
      axios.get(`${apiUrl}/v2/api/${apiPath}/products/all`)
      .then(res => {
        console.log("產品列表:", res.data.products);
        this.products = res.data.products;
      })
    }
  },
  components:{
    productModal
  },
  mounted() {
    this.getProducts();
  },
});

app.component('loading', VueLoading.Component)
app.mount('#app')
