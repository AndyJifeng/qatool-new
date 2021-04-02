<template>
  <a-table
    :columns="columns"
    :data-source="tableData"
    bordered
    size="small"
    :pagination="pagination"
    ><template
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
      v-for="col in ['name', 'standardName', 'aliases']"
      #[col]="{ text, record }"
      :key="col"
    >
      <div :style="{overflowX:'auto'}">
          <a-input
            v-if="record.editable && col === 'standardName'"
            style="margin: -5px 0"
            :value="text"
            @change="(e) => handleChange(e.target.value, record.key, col)"
          />
          <span v-else-if="col != 'aliases'">
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
              @click="showInput"
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
          <a @click="() => save(text, record.key, record.index)">Save</a>
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
        </span>
      </div>
    </template>
  </a-table>
</template>
<script>
import route from "../router/index";
import axios from '../utils/request'
import { SearchOutlined, PlusOutlined } from "@ant-design/icons-vue";
import { reactive, ref } from "vue";
import { offsetWidth,offsetHeight } from '../../dist/config'
export default {
  name: "PropertiesAliases",
  data() {
    return {
      pagination: {
        pageSize: Math.floor((offsetHeight-61)/39)-1,
      },
      tableData: [],
      editingKey: "",
      inputVisible: false,
      inputValue: "",
      isEditable: false,
      route: route,
      loading: true,
      entityLabel: "",
      propertyLabel: "",
      insertedTagsCount: 0,
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
    save(text, key, index) {
      const newData = [...this.tableData];
      const newCacheData = [...this.cacheData];
      const target = newData.filter((item) => key === item.key)[0];
      const targetCache = newCacheData.filter((item) => key === item.key)[0];
      this.tableData[index].aliases.isEditable = false;
      if (target && targetCache) {
        delete target.editable;
        this.tableData = newData;
        axios
          .post("/alterProperties", {
            entity: this.entityLabel,
            label: this.propertyLabel,
            body: {
              name: this.tableData[index].name,
              standardName: this.tableData[index].standardName,
              aliases: this.tableData[index].aliases,
            },
          })
          .then((response) => {
            if (response.status === 200) {
              this.$message.success("数据保存成功");
            } else {
              this.$message.errored("数据保存失败");
            }
          });
        Object.assign(targetCache, target);
        this.cacheData = newCacheData;
      }
      this.editingKey = "";
      this.tableData[this.index].aliases.isEditable = false;
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
    showInput() {
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
        this.insertedTagsCount++;
        tags.push(inputValue);
      }
      Object.assign(this, {
        tags,
        inputVisible: false,
        inputValue: "",
        isEditable: false,
      });
    },
  },
  mounted() {
    var that = this;
    this.entityLabel = this.route.currentRoute.query.entityLabel;
    this.propertyLabel = this.route.currentRoute.query.propertyLabel;
    axios
      .post("/loadProperties", {
        entity: this.entityLabel,
        label: this.propertyLabel,
      })
      .then((response) => {
        console.log(this.entityLabel, this.propertyLabel);
        if (response.status === 200) {
          let map = new Map();
          for (let i = 0; i < response.data.length; i++) {
            //console.log(response.data[i].name,map.get(response.data[i].name) === undefined)
            if (
              response.data[i].name !== "" &&
              typeof response.data[i].name !== "undefined" &&
              map.get(response.data[i].name) === undefined
            ) {
              this.tableData.push({
                index: this.tableData.length,
                key: response.data[i].name,
                name: response.data[i].name,
                standardName: response.data[i].standardName,
                aliases: response.data[i].aliases,
              });
              map.set(response.data[i].name, true);
            } else {
              //console.log(response.data[i].name)
            }
          }
          this.$nextTick(() => {
            this.loading = false;
          });
        }
      })
      .catch(function (error) {
        that.$message.error("数据导入失败");
        that.loading = false;
        console.log(error);
      });
  },
  setup() {
    const state = reactive({
      searchText: "",
      searchedColumn: "",
    });

    const searchInput = ref();
    const columns = [
      {
        title: "名称",
        dataIndex: "name",
        width: "15%",
        slots: { filterDropdown: "filterDropdown", filterIcon: "filterIcon" },
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

        ellipsis: true,
      },
      {
        title: "标准名",
        dataIndex: "standardName",
        width: "15%",
        slots: { customRender: "standardName" },
        ellipsis: true,
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
      columns,
      handleSearch,
      handleReset,
      searchText: "",
      searchInput,
      searchedColumn: "",
    };
  },
  components: {
    SearchOutlined,
    "plus-outlined": PlusOutlined,
  },
};
</script>
<style scoped>

</style>