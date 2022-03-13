<template>
    <div class="menu">
        <div class="com1">
            <a :class="{a1:who=='ERC20', a2:who=='ERC20'}" @click="select('ERC20')">ERC20</a>
            <a :class="{a1:who=='Vault', a2:who=='Vault'}" @click="select('Vault')">Vault</a>
            <a :class="{a1:who=='ERC721', a2:who=='ERC721'}" @click="select('ERC721')">ERC721</a>
            <a :class="{a1:who=='ERC777', a2:who=='ERC777'}" @click="select('ERC777')">ERC777</a>
        </div>
        <div class="com1">
            <component :is="who"></component>
        </div>
        
    </div>
</template>

<script>
import ERC20 from "./components/ERC20.vue";
import Vault from "./components/Vault.vue";
import ERC721 from "./components/ERC721.vue";
import ERC777 from "./components/ERC777.vue";

export default {
  name: 'App',
  data(){
      return{
          who:"ERC20"
      }
  },
  components: {
    ERC20,
    ERC721,
    ERC777,
    Vault
  },
  methods:{
      select(i){
          this.who=i;
      }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.menu{
    width:800px; 
    margin:0 auto;
}
.menu a{
    display: inline;
    margin: 80px;
    padding: 10px;
    background-color: aqua;
}
.a1{
    color: red;
}
.a2{
    font-size: 38px;
}
.com1{
    margin: 80px auto;
}

</style>
