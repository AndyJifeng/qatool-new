<template>
  <div id="app">
    <router-link to="home"></router-link>
  </div>
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" v-if="$route.meta.keepAlive">
        <p>缓存页面</p>
      </component>
    </keep-alive>
    <component :is="Component" v-if="!$route.meta.keepAlive">
      <p>没有缓存的页面</p>
    </component>
  </router-view>
</template>

<script>
import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

export default {
  name: "App",
  setup(props, context) {
    onMounted(() => {
      console.log(route);
      console.log(router);
      console.log(props);
      console.log(context);
    });
    const route = useRoute();
    const router = useRouter();
    return {};
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
