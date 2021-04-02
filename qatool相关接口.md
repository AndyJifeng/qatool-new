1. 指代词相关

   * 实体，属性标签

     * 读取：“loadEntityPropertyLabel".(GET).返回数据格式如下:
     * [

       * {
         * "entity":{name:'' ,standardName:'',aliases:{isEditable:false,tag:[]}}},
         * "property":[{name:'', standardName:'',aliases:{isEditable:false,tag:[]} } ]
         * }
       * ]
     * 保存：“alterEntityPropertyLabel" (POST).格式如下：

       { "entity":{name:'' ,standardName:'',aliases:{isEditable:false,tag:[]}},

       * "property":[{name:'', standardName:'',aliases:{isEditable:false,tag:[]}} ]
       * }
   * 关系标签

     * 读取：“loadRelationLabel".(GET).返回数据格式如下:
     * [
       * {name:'',standardName:'',aliases:{isEditable:false,tag:[]},source_name:'',target_name:''}
     * ]
     * 保存：“alterRelationLabel" (POST).格式如下：
       * {name:'',standardName:'',aliases:{isEditable:false,tag:[]},source_name:'',target_name:''}
   * 属性值

     * 读取：“loadProperties".(POST).参数：{property：" "}。返回数据如下：
     * [

       * {name:'',standardName:'',aliases:{isEditable:false,tag:[]}}
     * ]
     * 保存：“alterProperties"（POST）。格式如下：

       * {name:'',standardName:'',aliases:{isEditable:false,tag:[]}]}
2. 单实体模板

   * 读取：“loadSingleEntityTemplate"。（GET）。返回数据如下：
   * [
     * [
       * ID(主键):{template1,template2,template3,……}
     * ]
   * ]
   * 保存：“alterSingleEntityTemplate"。（POST）。格式如下：
   * [
     * ID(主键）:{template1,template2,template3,……}
   * ]
3. 单跳模板

   * 读取：‘loadSingleJumpTemplate'。（GET）。返回数据如下：
   * [
     * [
       * ID(主键):{template1,template2,template3,……}
     * ]
   * ]
   * 保存：‘alterSingleJumpTemplate'.(POST)。参数如下：
   * [
     * ID(主键):{template1,template2,template3,……}
   * ]
4. 多跳模板

   * 读取：‘loadMultipleJumpTemplate'。（GET）。返回数据如下：
   * [
     * [
       * ID(主键):{template1,template2,template3,……}
     * ]
   * ]
   * 保存：‘alterMultipleJumpTemplate'.(POST)。参数如下：
   * [
     * ID(主键):{template1,template2,template3,……}
   * ]
5. 数据导入配置文件

   * {"entity": [“label1","label2",…… ],"relation:" [“label1","label2",……]}
6. 修改配置文件

   1. `insertLabelConfig`POST：格式 {"entity": [“label1","label2",…… ],"relation:" [“label1","label2",……]}
7. 读取配置文件

   1. `loadLabelConfig` GET：返回：{"entity": [“label1","label2",…… ],"relation:" [“label1","label2",……]}
8. 读取文件，并转化数据格式

   1. loadEntityFile  POST: 格式：{"entityLabel": ""  , "file":" "}
   2. loadRelationFile  POST: 格式：：{"relationLabel":   , "file":" "}
   3. 数据格式：

      1. entity：

         [{

         * "entity":{name:'' ,standardName:'',aliases:{isEditable:false,tag:[   ]}}},
         * "property":[{name:'', standardName:'',aliases:{isEditable:false,tag:[  ]} } ]
         * }]
      2. relation:

         * [
           * {name:'',standardName:'',aliases:{isEditable:false,tag:[ ]},source_name:'',target_name:''}
         * ]
9. 保存文件

   1. insertEntityFile  POST: 格式：File
   2. insertRelationFile  POST: 格式：File
