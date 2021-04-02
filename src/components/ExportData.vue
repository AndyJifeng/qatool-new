<template>
  <div :style="{textAlign:'center'}">
    <a-tabs default-active-key="1">
      <a-tab-pane key="1" tab="导出指代词" force-render> 
        <a-button type="primary" @click="handleExport()">导出</a-button>
         </a-tab-pane>
      <a-tab-pane key="2" tab="导出模板库" force-render>
       <a href='"/findfile"' >下载模板</a>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script>
export default {
  name: "ExportData",
  methods:{
    exportSynonyms(){
      console.log("dsdsssasdsdsdsasaasasads")
    },
    handleExport() {
      var elemIF = document.createElement('iframe')
      elemIF.src = '/findfile'
      elemIF.style.display = 'none'
      document.body.appendChild(elemIF)
    }
  }
};
</script>
<style scoped>
</style>