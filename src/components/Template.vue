<template>
  <a-table
    v-if="tableVision"
    :columns="columns"
    :data-source="tableData"
    boardered
    size="small"
    :pagination="pagination"
    :style="{ marginBottom: '10px' }"
    :expandRowByClick="true"
    :expandedRowKeys="expandedRowKeys"
    @change="onChange"
    @expand="onexpand"
  >
    <template v-for="col in tableColumns" #[col]="{ text, record }" :key="col">
      <a-input
        v-if="record.editable && col != 'name'"
        style="margin: -5px 0"
        :value="text"
        @change="(e) => handleChange(e.target.value, record.key, col)"
      />
      <span v-else :style="{ fontSize: '10px' }">
        {{ text }}
      </span>
    </template>
    <template #operation="{ text, record, index }">
      <div class="editable-row-operations">
        <span v-if="record.editable">
          <a
            @click="save(text, record.key, index)"
            :style="{ fontSize: '10px' }"
            >保存</a
          >
           <a
            @click="cancel(text, record.key, index)"
            :style="{ fontSize: '10px' }"
            > 取消</a
          >
        </span>
        <span v-else>
          <a
            v-bind="editingKey !== '' ? { disabled: 'disabled' } : {}"
            @click="edit(record.key)"
            :style="{ fontSize: '10px' }"
          >
            修改
          </a>
          <span v-if="templateVision">
            <a-popconfirm
              v-if="tableData.length"
              title="Sure to delete?"
              @confirm="onDelete(record.key)"
            >
              <a :style="{ fontSize: '10px' }">删除</a>
            </a-popconfirm>
            <a
              v-if="record.key.indexOf('-') === -1"
              @click="onInsert(record.key, index)"
              :style="{ fontSize: '10px' }"
            >
              新增</a
            >
          </span>
        </span>
      </div>
    </template>
  </a-table>
  <div :style="{textAlign: 'center',
      margin: '0 auto',}">
  <a-button
    type="primary"
    @click="insertTemplate()"
    >新建模板</a-button
  >
  <a-button
    type="primary"
    @click="saveTemplate()"
    :style="{
      marginLeft:'20px'
    }"
    :disabled="data.length === 0"
    >保存模板</a-button
  >
  </div>
</template>

<script>
import axios from '../utils/request'
const columns = [];

export default {
  name: "QuestionTemplate",
  data() {
    return {
      pagination: {
        current:1,
        pageSize: 10,
      },
      columns,
      editingKey: "",
      tableData: this.data,
      tableVision: false,
      tableColumns: "",
      expandedRowKeys: [],
    };
  },
  props: {
    data: Array,
    key1:String,
    index:Number
  },
  methods: {
    onChange(pagination){
      this.pagination.current = pagination.current
    },
    onexpand(expanded, record) {
      //绑定的点击行事件
      const newData = [...this.tableData];
      const target = this.targetItem(newData, record.key);
      // console.log(expanded, record)//expanded =true ||false,record：本行数据
      if (expanded == false) {
        this.expandedRowKeys.splice(this.expandedRowKeys.indexOf(target.key));
      } else {
        this.expandedRowKeys.splice(this.expandedRowKeys.length, 0, target.key);
      }
    },
    targetItem(newData, key) {
      const target = newData.filter((item) => {
        if (item.key === key) return true;
        else {
          if (typeof item.children === "undefined") return false;
          for (var i = 0; i < item.children.length; i++) {
            if (item.children[i].key === key) return true;
          }
          return false;
        }
      });
      if (typeof target[0].children !== "undefined") {
        for (var i = 0; i < target[0].children.length; i++) {
          if (target[0].children[i].key === key) {
            var tmp = target[0].children[i];
            target.splice(0, 1);
            target.push(tmp);
            break;
          }
        }
      }
      return target[0];
    },
    onInsert(key) {
      var insertedKey = "";
      for (var i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].key === key) {
          this.tableData[i].children.splice(
            this.tableData[i].children.length,
            0,
            {
              key:
                this.tableData[i].key + "-" + this.tableData[i].children.length,
              template: "",
            }
          );
          insertedKey =
            this.tableData[i].key +
            "-" +
            (this.tableData[i].children.length - 1);
          break;
        }
      }
      //this.expandedRowKeys.push(this.tableData[i].key);
      this.edit(insertedKey);
      this.cacheData = this.tableData.map((item) => ({ ...item }));
    },
    onDelete(key) {
      console.log(key)
      const tableData = [...this.tableData];
      for (var i = 0; i < tableData.length; i++) {
        if (tableData[i].key === key) {
          tableData.splice(i, 1);
          break;
        } else {
          if (typeof tableData[i].children !== "undefined") {
            for (var j = 0; j < tableData[i].children.length; j++) {
              if (tableData[i].children[j].key === key) {
                tableData[i].children.splice(j, 1);
                i = tableData.length;
                break;
              }
            }
          }
        }
      }
      this.tableData = tableData;
      this.cacheData = this.tableData.map((item) => ({ ...item }));
    },
    handleChange(value, key, column) {
      const newData = [...this.tableData];
      const target = this.targetItem(newData, key);
      if (target) {
        target[column] = value;
        this.tableData = newData;
      }
    },
    edit(key) {
      const newData = [...this.tableData];
      const target = this.targetItem(newData, key);
      this.editingKey = key;
      if (target) {
        target.editable = true;
        this.tableData = newData;
      }
      this.cacheData = this.tableData.map((item) => ({ ...item }));
    },
    save(text, key) {
      const newData = [...this.tableData];
      const target = this.targetItem(newData, key);
      const newCacheData = [...this.cacheData];
      const targetCache = this.targetItem(newCacheData, key);
      if (target && targetCache) {
        delete target.editable;
        this.tableData = newData;
        Object.assign(targetCache, target);
        this.cacheData = newCacheData;
        /**if (this.Class == 2) {
            axios
              .post("/insertPropertiesLabelTable", this.cacheData)
              .then((response) => {
                console.log(response);
              })
              .catch((error) => {
                console.log(error);
              });
          }
        } else if (this.Class == 2) {
          if (this.targetCache.index == 1) {
            axios
              .post(
                "/insertSingleEntityTemplate",
                this.targetCache.template
              )
              .then((response) => {
                console.log(response);
              })
              .catch((error) => {
                console.log(error);
              });
          } else if (this.targetCache.index == 2) {
            axios
              .post("/insertSingleJumpTemplate", this.targetCache.template)
              .then((response) => {
                console.log(response);
              })
              .catch((error) => {
                console.log(error);
              });
          } else {
            axios
              .post(
                "/insertMultipleJumpTemplate",
                this.targetCache.template
              )
              .then((response) => {
                console.log(response);
              })
              .catch((error) => {
                console.log(error);
              });
          }
        } else {
          if (this.cacheData.index == 1) {
            //标签初始化：实体标签
            console.log("标签初始化：实体标签");
          } else if (this.cacheData.index == 2) {
            //标签初始化：关系标签
            console.log("标签初始化：关系标签");
          } else {
            console.log("标签初始化：属性标签"); //标签初始化：属性标签
          }
        }
      }
      */
        this.editingKey = "";
      }
    },
    cancel(text, key) {
      const newData = [...this.tableData];
      const target = this.targetItem(newData, key);
      this.editingKey = "";
      if (target) {
        if (target.template === "") {
          delete target.editable;
          this.tableData = newData;
          this.onDelete(target.key);
        } else {
          Object.assign(
            target,
            this.cacheData.filter((item) => key === item.key)[0]
          );
          delete target.editable;
          this.tableData = newData;
        }
      }
    },
    saveTemplate() {
      let data = [];
      let index = this.index
      var templates = [];
      for (let i = 0; i < this.tableData.length; i++) {
        templates.push(this.tableData[i].template);
        if (typeof this.tableData[i].children !== "undefined") {
          for (let j = 0; j < this.tableData[i].children.length; j++) {
            templates.push(this.tableData[i].children[j].template);
          }
        }
        
      }
      data.push([this.key1, templates]);
      if (index == 1) {
        axios
          .post("/insertOneEntityTemplate", data)
          .then((response) => {
            if (response.status === 200) {
              this.$message.success("模板保存成功!");
            } else {
              this.$message.success("模板保存失败!");
            }
          });
      } else if (index == 2) {
        axios
          .post("/insertTwoEntityTemplate", data)
          .then((response) => {
            if (response.status === 200) {
              this.$message.success("模板保存成功!");
            } else {
              this.$message.success("模板保存失败!");
            }
          });
      } else {
        axios
          .post("/insertThreeEntityTemplate", data)
          .then((response) => {
            if (response.status === 200) {
              this.$message.success("模板保存成功!");
            } else {
              this.$message.success("模板保存失败!");
            }
          });
      }
    },
    insertTemplate() {
      var key = this.key1+(this.tableData.length<10?'0'+this.tableData.length:this.tableData.length)
      this.tableData.splice(this.tableData.length, 0, {
        key: key,
        template: "",
        index:this.index
      });
      this.pagination.current = this.tableData.length / 10 + 1
      console.log(key,this.index);
      //this.expandedRowKeys.push(this.tableData[i].key);
      this.edit(key);
      this.cacheData = this.tableData.map((item) => ({ ...item }));
    },
  },
  mounted() {
    columns.splice(0, columns.length);
    columns.push(
      {
        title: "模板",
        dataIndex: "template",
        width: "85%",
        slots: { customRender: "template" },
      },
      {
        title: "operation",
        dataIndex: "operation",
        slots: { customRender: "operation" },
      }
    );
    this.tableColumns = ["template"];
    this.templateVision = true;
    this.tableVision = true;
    this.tableData = this.data
  },
};
</script>
<style scoped>
</style>