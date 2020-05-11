<template>
  <div id="app">
    <div class="box">
      <h4>吸顶测试</h4>
      <h4>吸顶测试</h4>
      <h4>吸顶测试</h4>
      <div class="container" ref="fixedHeaderRoot" id="fixedHeaderRoot">
        <div class="title-box" :class="headerFixed== true ? 'isFixed' :''">测试吸顶</div>
      </div>
      <h3>快下来</h3>
      <h4>吸顶测试</h4>
      <h4>吸顶测试</h4>
      <h4>吸顶测试</h4>
      <h4>吸顶测试</h4>
      <h4>吸顶测试</h4>
    </div>
  </div>
</template>
<script>
export default {
  data(){
      return {
        headerFixed: false,
      }
    },
    created(){
      this.headerFixed = false;
      window.addEventListener('scroll',this.handleScroll,true)
    },
    // mounted(){
    //   window.addEventListener('scroll',this.initHeight);
    //   this.$nextTick( () => {
    //     this.offsetTop = document.querySelector('#boxFixed').offsetTop;
    //   })
    // },
    methods:{
      handleScroll(){
        // let offsetTop = this.$refs.fixedHeaderRoot.getBoundingClientRect().top
        let offsetTop = this.$el.querySelector('#fixedHeaderRoot').getBoundingClientRect().top
        this.headerFixed = offsetTop < 0 ? true:false
      }
      // initHeight () {
      //   var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      //   this.isFixed = scrollTop > this.offsetTop ? true : false;
      // },
    },
    destroyed () {
      window.removeEventListener('scroll', this.handleScroll)
    }
}
</script>>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
.container {
  width: 500px;
  height: 40px;
  border: 2px dashed pink;
  border-radius: 20px;
  margin: 0 auto;
  line-height: 40px;
  background: #eeeeee;
}
.isFixed {
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  height: 40px;
  border: 2px dashed pink;
  border-radius: 20px;
  margin: 0 auto;
  line-height: 40px;
  background: #eeeeee;
}
</style>
