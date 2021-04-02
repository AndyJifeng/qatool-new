
<template>
  <a-table
    :columns="data[0].key.charAt(0) === '0' ? entityColumns : relationColumns"
    :data-source="tableData"
    bordered
    :loading="loading"
  >
    <template
      #filterDropdown="{
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
        column,
      }"
    >
      <div style="padding: 8px">
        <a-input
          ref="searchInput"
          :placeholder="`Search ${column.dataIndex}`"
          :value="selectedKeys[0]"
          style="width: 188px; margin-bottom: 8px; display: block"
          @change="
            (e) => setSelectedKeys(e.target.value ? [e.target.value] : [])
          "
          @pressEnter="handleSearch(selectedKeys, confirm, column.dataIndex)"
        />
        <a-button
          type="primary"
          size="small"
          style="width: 90px; margin-right: 8px"
          @click="handleSearch(selectedKeys, confirm, column.dataIndex)"
        >
          <template #icon><SearchOutlined /></template>
          Search
        </a-button>
        <a-button
          size="small"
          style="width: 90px"
          @click="handleReset(clearFilters)"
        >
          Reset
        </a-button>
      </div>
    </template>
    <template #filterIcon="filtered">
      <search-outlined :style="{ color: filtered ? '#108ee9' : undefined }" />
    </template>
    <template
      v-for="col in data[0].key.charAt(0) === '0'
        ? ['name', 'standardName', 'aliases']
        : ['name', 'direction', 'standardName', 'aliases']"
      #[col]="{ text, record }"
      :key="col"
    >
      <div :style="{ overflowX: 'auto' }">
        <span v-if="col === 'name' && record.name !== data[0].name">
          ——{{ text }}
        </span>
        <span v-else-if="col === 'name' && record.name === data[0].name">{{
          text
        }}</span>
        <span v-else-if="col === 'direction'"
          >{{ record.source_name }}->{{ record.target_name }}</span
        >
        <a-input
          v-else-if="record.editable && col === 'standardName'"
          style="margin: -5px 0"
          :value="text"
          @change="(e) => handleChange(e.target.value, record.key, col)"
        />
        <span v-else-if="!record.editable && col === 'standardName'">
          {{ text }}
        </span>
        <div v-else>
          <span v-if="text.isEditable">
            <a-input
              v-if="inputVisible"
              ref="input"
              type="text"
              size="small"
              :style="{ width: '78px' }"
              :value="inputValue"
              @change="handleInputChange"
              @blur="handleInputConfirm(record.index)"
              @keyup.enter="handleInputConfirm(record.index)"
            />
            <a-tag
              v-else
              @click="entityShowInput"
              style="background: #fff; border-style: dashed"
            >
              <plus-outlined />
              添加别名
            </a-tag></span
          >
          <template v-for="(alia, index) in text.tag" :key="index">
            <a-tooltip v-if="alia.length > 8" :title="alia">
              <a-tag
                :key="alia"
                :closable="text.isEditable"
                @close="() => handleClose(alia, record.index)"
              >
                {{ `${alia.slice(0, 8)}...` }}
              </a-tag>
            </a-tooltip>
            <a-tag
              v-else
              :key="alia"
              :closable="text.isEditable"
              @close="() => handleClose(alia, record.index)"
            >
              {{ alia }}
            </a-tag>
          </template>
        </div>
      </div>
    </template>
    <template #operation="{ text, record }">
      <div class="editable-row-operations">
        <span v-if="record.editable">
          <a @click="() => save(text, record.key, record)">Save</a>
          <a @click="() => cancel(text, record.key, record.index)"> Cancel</a>
        </span>
        <span v-else>
          <a
            v-bind="editingKey !== '' ? { disabled: 'disabled' } : {}"
            @click="edit(record.key, record.index)"
            :style="{ fontSize: '10px' }"
          >
            修改
          </a>
          <a
            v-if="record.name != data[0].name"
            @click="push(record.key)"
            :style="{ fontSize: '10px' }"
          >
            属性值</a
          >
        </span>
      </div>
    </template>
  </a-table>
</template>
<script>
import router from "../router/index";
import axios from "../utils/request";

import { SearchOutlined, PlusOutlined } from "@ant-design/icons-vue";
import { reactive, ref } from "vue";

const push = (key) => {
  var entityLabel = key.split("-")[1];
  var propertyLabel = key.split("-")[2];
  router.push({
    path: "/propertiesAliases",
    query: { entityLabel: entityLabel, propertyLabel: propertyLabel },
  });
};

export default {
  name: "AliasesTable",
  data() {
    return {
      tableData: this.data,
      editingKey: "",
      inputVisible: false,
      inputValue: "",
      index: "", // 每次要修改第几行
      isEditable: false,
      push,
      loading: false,
      insertedTagsCount: 0, // 保存每行新添加的tag数量，便于cancel之后删除
    };
  },
  props: {
    data: Array,
  },
  methods: {
    // 表格方法
    handleChange(value, key, column) {
      const newData = [...this.tableData];
      const target = newData.filter((item) => key === item.key)[0];
      if (target) {
        target[column] = value;
        this.tableData = newData;
      }
    },
    edit(key, index) {
      this.insertedTagsCount = 0;
      const newData = [...this.tableData];
      const target = newData.filter((item) => key === item.key)[0];
      this.editingKey = key;
      this.tableData[index].aliases.isEditable = true;
      if (target) {
        target.editable = true;
        this.tableData = newData;
      }
      this.cacheData = this.tableData.map((item) => ({ ...item }));
    },
    save(text, key, record) {
      const newData = [...this.tableData];
      const newCacheData = [...this.cacheData];
      const target = newData.filter((item) => key === item.key)[0];
      const targetCache = newCacheData.filter((item) => key === item.key)[0];
      if (target && targetCache) {
        delete target.editable;
        this.tableData = newData;
        Object.assign(targetCache, target);
        this.cacheData = newCacheData;
        this.loading = true;
        var body;
        // 实体，属性label
        if (key.charAt(0) == 0) {
          body = {
            entity: this.tableData[0],
            property: this.tableData.slice(1, this.tableData.length),
          };
          this.$nextTick(() => {
            axios
              .post("/insertEntityPropertyLabelTable", body)
              .then((response) => {
                if (response.status === 200) {
                  this.$message.success("保存成功！");
                } else {
                  this.$message.error("保存失败！请重试");
                }
              });
          });
        }
        if (key.charAt(0) == 1) {
          body = record;
          this.$nextTick(() => {
            axios.post("/insertRelationLabelTable", body).then((response) => {
              if (response.status === 200) {
                this.$message.success("保存成功！");
              } else {
                this.$message.error("保存失败！请重试");
              }
            });
          });
        }
        this.loading = false;
      }
      this.editingKey = "";
      this.tableData[record.index].aliases.isEditable = false;
    },
    cancel(text, key, index) {
      this.tableData[index].aliases.isEditable = false;
      this.tableData[index].aliases.tag = this.tableData[
        index
      ].aliases.tag.splice(
        0,
        this.tableData[index].aliases.tag.length - this.insertedTagsCount
      );
      const newData = [...this.tableData];
      const target = newData.filter((item) => key === item.key)[0];
      this.editingKey = "";
      if (target) {
        Object.assign(
          target,
          this.cacheData.filter((item) => key === item.key)[0]
        );
        delete target.editable;
        this.tableData = newData;
      }
    },

    // 同义词tag
    handleClose(removedTag, index) {
      const tags = this.tableData[index].aliases.tag.filter(
        (alia) => alia !== removedTag
      );
      this.tableData[index].aliases.tag = tags;
    },
    entityShowInput() {
      this.inputVisible = true;
      this.$nextTick(function () {
        this.$refs.input.focus();
      });
    },
    handleInputChange(e) {
      this.inputValue = e.target.value;
    },
    handleInputConfirm(index) {
      const inputValue = this.inputValue;
      let tags = this.tableData[index].aliases.tag;
      if (inputValue && tags.indexOf(inputValue) === -1) {
        tags.push(inputValue);
        this.insertedTagsCount++;
      }
      Object.assign(this, {
        tags,
        inputVisible: false,
        inputValue: "",
      });
    },
  },
  components: {
    SearchOutlined,
    "plus-outlined": PlusOutlined,
  },
  setup() {
    const state = reactive({
      searchText: "",
      searchedColumn: "",
    });

    const searchInput = ref();
    const entityColumns = [
      {
        title: "名称",
        dataIndex: "name",
        width: "15%",
        slots: {
          customRender: "name",
          filterDropdown: "filterDropdown",
          filterIcon: "filterIcon",
        },
        onFilter: (value, record) =>
          record.name.toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: (visible) => {
          if (visible) {
            setTimeout(() => {
              console.log(searchInput.value);
              searchInput.value.focus();
            }, 0);
          }
        },
      },
      {
        title: "标准名",
        dataIndex: "standardName",
        width: "15%",
        slots: { customRender: "standardName" },
      },
      {
        title: "别名词",
        dataIndex: "aliases",
        width: "60%",
        slots: { customRender: "aliases" },
        ellipsis: true,
      },
      {
        title: "operation",
        dataIndex: "operation",
        slots: { customRender: "operation" },
      },
    ];
    const relationColumns = [
      {
        title: "名称",
        dataIndex: "name",
        width: "12%",
        slots: {
          customRender: "name",
          filterDropdown: "filterDropdown",
          filterIcon: "filterIcon",
        },
        onFilter: (value, record) =>
          record.name.toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: (visible) => {
          if (visible) {
            setTimeout(() => {
              console.log(searchInput.value);
              searchInput.value.focus();
            }, 0);
          }
        },
      },
      {
        title: "方向",
        dataIndex: "direction",
        width: "15%",
        slots: { customRender: "direction" },
      },
      {
        title: "标准名",
        dataIndex: "standardName",
        width: "12%",
        slots: { customRender: "standardName" },
      },
      {
        title: "别名词",
        dataIndex: "aliases",
        width: "50%",
        slots: { customRender: "aliases" },
        ellipsis: true,
      },
      {
        title: "operation",
        dataIndex: "operation",
        slots: { customRender: "operation" },
      },
    ];
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
      confirm();
      state.searchText = selectedKeys[0];
      state.searchedColumn = dataIndex;
    };
    const handleReset = (clearFilters) => {
      clearFilters();
      state.searchText = "";
    };
    return {
      entityColumns,
      relationColumns,
      handleSearch,
      handleReset,
      searchText: "",
      searchInput,
      searchedColumn: "",
    };
  },
};
</script>
<style scoped>
.highlight {
  background-color: rgb(255, 192, 105);
  padding: 0px;
}
.ant-table td {
  white-space: nowrap;
}
</style>