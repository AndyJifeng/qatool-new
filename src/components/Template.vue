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
    id="table"
  >
    <template v-for="col in tableColumns" #[col]="{ text, record }" :key="col">
      <div v-if="index === 1">
        <span v-if="col === 'entity'">{{ record.key.split("-")[0] }}</span>
        <span v-else-if="col === 'property'">{{
          record.key.split("-")[1]
        }}</span>
        <span v-else-if="col === 'questionType'">{{
          record.key.split("-")[2]
        }}</span>
        <a-input
          v-if="record.editable && col === 'template'"
          style="margin: -5px 0"
          :value="text"
          @change="(e) => handleChange(e.target.value, record.key, col)"
        />
        <span v-else>
          {{ text }}
        </span>
      </div>
      <div v-else-if="index === 2">
        <span v-if="col === 'entity1'">{{ record.key.split("-")[0] }}</span>
        <span v-if="col === 'relation'">{{ record.key.split("-")[1] }}</span>
          <span v-if="col === 'entity2'">{{ record.key.split("-")[2] }}</span>
        <span v-else-if="col === 'property'">{{
          record.key.split("-")[3]
        }}</span>
        <span v-else-if="col === 'questionType'">{{
          record.key.split("-")[4]
        }}</span>
        <a-input
          v-if="record.editable && col === 'template'"
          style="margin: -5px 0"
          :value="text"
          @change="(e) => handleChange(e.target.value, record.key, col)"
        />
        <span v-else :style="{ fontSize: '12px' }">
          {{ text }}
        </span>
      </div>
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
          >
            取消</a
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
          </span>
        </span>
      </div>
    </template>
  </a-table>
  <div
    v-if="insertTemplateVision"
    :style="{ textAlign: 'center', margin: '0 auto' }"
  >
    <a-button
      type="primary"
      @click="function(){insertTemplateModelVision = true
        }
      "
      >新建模板</a-button
    >
  </div>
  <a-modal :visible="insertTemplateModelVision" @ok="insertTemplate" width="50%" @cancel="insertTemplateModelVision=false">
    <a-form
      :label-col="{ span: 5 }"
      :wrapper-col="{ span: 12 }"
      :rules="rules"
    >
      <template v-if="index === 1">
        <a-form-item label="选择实体">
          <a-select
            placeholder="Please input your entity"
            v-model="selectedSingleEntityCascaderEntity"
            :value="selectedSingleEntityCascaderEntity"
            @select="handleSingleEntityCascaderEntityChange"
          >
            <a-select-option
              v-for="entity in singleEntityCascaderEntity"
              :key="entity"
            >
              {{ entity }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="选择属性">
          <a-select
            placeholder="Please input your property"
            v-model="selectedSingleEntityCascaderProperty"
            :value="selectedSingleEntityCascaderProperty"
            @select="handleSingleEntityCascaderPropertyChange"
          >
            <a-select-option
              v-for="property in singleEntityCascaderProperty[
                selectedSingleEntityCascaderEntity
              ]"
              :key="property"
              :value="property"
            >
              {{ property }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </template>
      <template v-else-if="index === 2">
        <a-form-item label="选择实体1">
          <a-select
            placeholder="Please input your entity"
            v-model="selectedSingleJumpCascaderEntity1"
            :value="selectedSingleJumpCascaderEntity1"
            @select="handleSingleJumpCascaderEntity1Change"
          >
            <a-select-option
              v-for="entity in singleJumpCascaderEntity1"
              :key="entity"
            >
              {{ entity }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="选择关系">
          <a-select
            placeholder="Please input your relation"
            v-model="selectedSingleJumpCascaderRelation"
            :value="selectedSingleJumpCascaderRelation"
            @select="handleSingleJumpCascaderRelationChange"
          >
            <a-select-option
              v-for="relation in singleJumpCascaderRelation[
                selectedSingleJumpCascaderEntity1
              ]"
              :key="relation"
            >
              {{ relation }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="选择实体2">
          <a-select
            placeholder="Please input your entity2"
            v-model="selectedSingleJumpCascaderEntity2"
            :value="selectedSingleJumpCascaderEntity2"
            @select="handleSingleJumpCascaderEntity2Change"
          >
            <a-select-option
              v-for="entity2 in singleJumpCascaderEntity2[
                selectedSingleJumpCascaderRelation
              ]"
              :key="entity2"
            >
              {{ entity2 }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="选择属性">
          <a-select
            placeholder="Please input your property"
            v-model="selectedSingleJumpCascaderProperty"
            :value="selectedSingleJumpCascaderProperty"
            @select="handleSingleJumpCascaderPropertyChange"
          >
            <a-select-option
              v-for="property in singleJumpCascaderProperty[
                selectedSingleJumpCascaderEntity2
              ]"
              :key="property"
              :value="property"
            >
              {{ property }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </template>
      <a-form-item label="选择问题类型">
        <a-select
          placeholder="Please input your question type"
          v-model="selectedQuestionType"
          :value="selectedQuestionType"
          @select="handleQuestionTypeChange"
          style="width: 120px"
        >
          <a-select-option
            v-for="questionType in questionTypes"
            :key="questionType"
          >
            {{ questionType }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="输入模板">
        <a-input
           @change="insertedTemplateChange"
          placeholder="Please input your template"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import axios from "../utils/request";
const columns = [];
const rules = {
  entity: [
    {
      required: true,
      message: "Please input entity",
      trigger: "blur",
    },
  ],
  property: [
    {
      required: true,
      message: "Please select property",
      trigger: "blur",
    },
  ],
  entity1: [
    {
      required: true,
      message: "Please input entity1",
      trigger: "blur",
    },
  ],
  relation: [
    {
      required: true,
      message: "Please input relation",
      trigger: "blur",
    },
  ],
  questionType: [
    {
      required: true,
      message: "Please select question type",
      trigger: "blur",
    },
  ],
};
export default {
  name: "QuestionTemplate",
  data() {
    return {
      pagination: {
        current: 1,
        pageSize: 10,
      },
      columns,
      editingKey: "",
      tableData: [],
      tableVision: false,
      tableColumns: "",
      expandedRowKeys: [],
      insertTemplateVision:false,
      insertSingleEntityTemplateVision: false,
      insertSingleEntityTemplateModelVision: false,
      selectedSingleEntityCascaderEntity: "",
      selectedSingleEntityCascaderProperty: "",
      selectedSingleJumpCascaderEntity1: "",
      selectedSingleJumpCascaderEntity2: "",
      selectedSingleJumpCascaderRelation: "",
      selectedSingleJumpCascaderProperty: "",
      questionTypes: [
        "查找实体",
        "查找属性",
        "比较问题",
        "统计问题",
        "判断问题",
      ],
      selectedQuestionType: "查找实体",
      insertedTemplate: "",
      insertTemplateModelVision: false,
      rules
    };
  },
  props: {
    data: Array,
    key1: String,
    index: Number,
    singleEntityCascaderEntity: Array,
    singleEntityCascaderProperty: Object,
    singleJumpCascaderEntity1: Array,
    singleJumpCascaderEntity2: Object,
    singleJumpCascaderRelation: Object,
    singleJumpCascaderProperty: Object,
  },
  methods: {
    insertedTemplateChange(value){
      this.insertedTemplate = value.target.value
    },
    onChange(pagination) {
      this.pagination.current = pagination.current;
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
      console.log(key);
      const tableData = [...this.tableData];
      for (var i = 0; i < tableData.length; i++) {
        if (tableData[i].key === key) {
          tableData.splice(i, 1);
          break;
        }
      }
      this.tableData = tableData;
      this.saveTemplate(key, "删除");
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
        this.saveTemplate(key, "保存");
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
    saveTemplate(key, operation) {
      let data = [[key.substr(0, key.length - 4), []]];
      let index = this.index;
      // 查找同一组意思的模板
      for (let i = 0; i < this.tableData.length; i++) {
        if (
          this.tableData[i].key.substr(0, this.tableData[i].key.length - 4) ===
          key.substr(0, key.length - 4)
        ) {
          data[0][1].push(this.tableData[i].template);
        }
      }
      if (index == 1) {
        axios.post("/insertOneEntityTemplate", data).then((response) => {
          if (response.status === 200) {
            this.$message.success("模板" + operation + "成功!");
          } else {
            this.$message.success("模板" + operation + "失败!");
          }
        });
      } else if (index == 2) {
        axios.post("/insertTwoEntityTemplate", data).then((response) => {
          if (response.status === 200) {
            this.$message.success("模板" + operation + "成功!");
          } else {
            this.$message.success("模板" + operation + "失败!");
          }
        });
      } else {
        axios.post("/insertThreeEntityTemplate", data).then((response) => {
          if (response.status === 200) {
            this.$message.success("模板" + operation + "成功!");
          } else {
            this.$message.success("模板" + operation + "失败!");
          }
        });
      }
    },
    insertTemplate() {
      var key;
      if (this.index === 1) {
        key =
          this.selectedSingleEntityCascaderEntity +'-'+
          this.selectedSingleEntityCascaderProperty +'-'+
          this.selectedQuestionType;
      } else if (this.index === 2) {
        key =
          this.selectedSingleJumpCascaderEntity1 +'-'+
          this.selectedSingleJumpCascaderRelation +'-'+
          this.selectedSingleJumpCascaderEntity2 +'-'+
          this.selectedSingleJumpCascaderProperty+'-'+
          this.selectedQuestionType;
          
      }
      
      // 填充key，保证表中key格式一致

      key = key+"-"+(parseInt)(Math.random() * 900 +100) 
      this.tableData.splice(this.tableData.length, 0, {  
          key: key,
          template: this.insertedTemplate,
          index: this.index,
        });
      this.saveTemplate(key,'添加')
      this.insertedTemplate = ""
      this.insertTemplateModelVision = false
      this.pagination.current = this.tableData.length / 10 + 1;
      //this.expandedRowKeys.push(this.tableData[i].key);

      this.cacheData = this.tableData.map((item) => ({ ...item }));
    },

    loadSingleEntityOptionsData() {
        this.selectedSingleEntityCascaderEntity = this.singleEntityCascaderEntity[0];
        this.selectedSingleEntityCascaderProperty = this.singleEntityCascaderProperty[
          this.singleEntityCascaderEntity[0]
        ][0];
    },
    handleSingleEntityCascaderEntityChange(value) {
      this.selectedSingleEntityCascaderEntity = value;
      this.selectedSingleEntityCascaderProperty = this.singleEntityCascaderProperty[
        value
      ][0];
    },
    handleSingleEntityCascaderPropertyChange(value) {
      this.selectedSingleEntityCascaderProperty = value;
    },
    handleQuestionTypeChange(value) {
      this.selectedQuestionType = value;
    },
    loadSingleJumpOptionsData() {
      this.selectedSingleJumpCascaderEntity1 = this.singleJumpCascaderEntity1[0]
       this.selectedSingleJumpCascaderRelation = this.singleJumpCascaderRelation[this.selectedSingleJumpCascaderEntity1][0];
        this.selectedSingleJumpCascaderEntity2 = this.singleJumpCascaderEntity2[this.selectedSingleJumpCascaderRelation][0];
        this.selectedSingleJumpCascaderProperty = this.singleJumpCascaderProperty[this.selectedSingleJumpCascaderEntity2][0]
    },
    handleSingleJumpCascaderEntity1Change(value) {
      this.selectedSingleJumpCascaderEntity1 = value;
      if(typeof(this.singleJumpCascaderRelation[value]) !== 'undefined'){
        this.selectedSingleJumpCascaderRelation = this.singleJumpCascaderRelation[
          value
        ][0];
        this.selectedSingleJumpCascaderEntity2 = this.singleJumpCascaderEntity2[this.selectedSingleJumpCascaderRelation][0]
        this.selectedSingleEntityCascaderProperty = this.singleJumpCascaderProperty[this.selectedSingleJumpCascaderEntity2][0]
      }
      else{
        this.selectedSingleJumpCascaderRelation = ""
         this.selectedSingleJumpCascaderEntity2 = ""
        this.selectedSingleJumpCascaderProperty =""
      }
    },
    handleSingleJumpCascaderRelationChange(value) {
      this.selectedSingleJumpCascaderRelation = value;
      this.selectedSingleJumpCascaderEntity2= this.singleJumpCascaderEntity2[
        value
      ][0];
    },
    handleSingleJumpCascaderEntity2Change(value) {
      this.selectedSingleJumpCascaderEntity2 = value;
      this.selectedSingleJumpCascaderProperty= this.singleJumpCascaderProperty[
        value
      ][0];
    },
    handleSingleJumpCascaderPropertyChange(value) {
      this.selectedSingleJumpCascaderProperty = value;
    },
  },
  mounted() {
    this.tableData.splice(0, this.tableData.length);
    columns.splice(0, columns.length);
    if (this.index == 1) {
      columns.push(
        {
          title: "实体",
          dataIndex: "entity",
          width: "15%",
          slots: { customRender: "entity" },
        },
        {
          title: "属性",
          dataIndex: "property",
          width: "15%",
          slots: { customRender: "property" },
        },
        {
          title: "问题类型",
          dataIndex: "questionType",
          width: "15%",
          slots: { customRender: "questionType" },
        },
        {
          title: "模板",
          dataIndex: "template",
          width: "50%",
          slots: { customRender: "template" },
        },
        {
          title: "operation",
          dataIndex: "operation",
          slots: { customRender: "operation" },
        }
      );
      this.tableColumns = ["entity", "property", "questionType", "template"];
      this.loadSingleEntityOptionsData()
    } else if (this.index == 2) {
      columns.push(
        {
          title: "实体1",
          dataIndex: "entity1",
          width: "10%",
          slots: { customRender: "entity1" },
        },
        {
          title: "关系",
          dataIndex: "relation",
          width: "10%",
          slots: { customRender: "relation" },
        },
        {
          title: "实体2",
          dataIndex: "entity2",
          width: "10%",
          slots: { customRender: "entity2" },
        },
        {
          title: "属性",
          dataIndex: "property",
          width: "10%",
          slots: { customRender: "property" },
        },
        {
          title: "问题类型",
          dataIndex: "questionType",
          width: "15%",
          slots: { customRender: "questionType" },
        },
        {
          title: "模板",
          dataIndex: "template",
          width: "60%",
          slots: { customRender: "template" },
        },
        {
          title: "operation",
          dataIndex: "operation",
          slots: { customRender: "operation" },
        }
      );
      this.tableColumns = [
        "entity1",
        "relation",
        "entity2",
        "property",
        "questionType",
        "template",
      ];
      this.loadSingleJumpOptionsData()
    } else {
      columns.push(
        {
          title: "模板",
          dataIndex: "template",
          width: "60%",
          slots: { customRender: "template" },
        },
        {
          title: "operation",
          dataIndex: "operation",
          slots: { customRender: "operation" },
        }
      );
      this.tableColumns = ["template"];
    }
    // 为0表示有参数传进来，不为0表示用户进行了选择
    if (this.key1 !== "0") {
      for (let i = 0; i < this.data.length; i++) {
        if (
          this.data[i].key.substr(0, this.data[i].key.length - 4) === this.key1
        ) {
          this.tableData.push(this.data[i]);
        }
      }
    } else {
      this.tableData = this.data;
    }
    this.insertTemplateVision = true;
    this.templateVision = true;
    this.tableVision = true;
  },
};
</script>
<style scoped>
#table {
  font-family: "微软雅黑", "Heiti SC", "文泉驿正黑体", "黑体", "Sans-serif";
}
</style>