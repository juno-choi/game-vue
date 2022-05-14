<template>
    <nav class="navbar navbar-expand-md navbar-dark bg-dark mb-4">
      <div class="container-fluid">
        <router-link class="nav-link" to="/"><span class="navbar-brand">심심해서</span></router-link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
          <a class="navbar-toggler-icon"></a>
        </button>
        <div class="collapse navbar-collapse" id="navbarCollapse">
          <ul class="navbar-nav me-auto mb-2 mb-md-0">
            <li class="nav-item">
              <router-link class="nav-link" to="/eats">뽑기</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/sunhj">공사중</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/tissue">CABO</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/about">로그인테스트</router-link>
            </li>
          </ul>
          <form class="d-flex">
            <div v-if="!login">
              <router-link  to="/login"><button type="button" class="btn btn-primary me-2">로그인</button></router-link>
              <router-link to="/join"><button type="button" class="btn btn-outline-light">회원가입</button></router-link>
            </div>
            <div v-else>
              <button type="button" class="btn btn-secondary me-2">{{$store.state.user.userName}}</button>
              <button type="button" @click="logout" class="btn btn-primary me-2">로그아웃</button>
            </div>
          </form>
        </div>
      </div>
    </nav>
</template>

<style>
@import url('@/css/navbar-top.css');
.bd-placeholder-img {
  font-size: 1.125rem;
  text-anchor: middle;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
}

@media (min-width: 768px) {
  .bd-placeholder-img-lg {
    font-size: 3.5rem;
  }
}
</style>

<script>

export default {
  name: 'HeaderComponent',
  methods:{
    logout(){
      this.$store.dispatch('logout');
    }
  },
  computed:{
    login(){
      return this.$store.getters.getLogin;
    }
  }
}
</script>
