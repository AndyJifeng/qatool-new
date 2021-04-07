<template>
  <div>
    <a-layout>
      <a-layout-sider
        width="230px"
        :style="{
          overflow: 'auto',
          height: '100vh',
          left: 0,
          borderRight: '1px solid black',
          textAlign: 'center',
        }"
        theme="light"
      >
        <a onclick="javascript:(location.reload())"
          ><strong id="logoStyle">智能问答预处理平台</strong></a
        >
        <a-tree
          :style="{
            marginLeft: '10px',
            textAlign: 'left',
            marginTop: '10px',
          }"
          :tree-data="treeData"
          v-model:expandedKeys="expandedKeys"
          v-model:selectedKeys="selectedKeys"
          @select="onSelect"
        ></a-tree>
      </a-layout-sider>
      <a-layout>
        <a-layout-content :style="{ textAlign: 'center', paddingTop: '10px' }">
          <div v-if="importDataVision">
            <a @click="importGraphDatabaseData()">
              <div
                :style="{
                  border: '1px dashed',
                  textAlign: 'center',
                  width: '25%',
                  background: '#FFFFFF',
                  marginLeft: '5%',
                  marginTop: '10%',
                  display: 'inline-block',
                }"
              >
                <PlusOutlined
                  :style="{ marginTop: '10px', fontSize: '600%' }"
                ></PlusOutlined>
                <div
                  :style="{
                    color: '#2c3e50',
                    marginTop: '20px',
                    marginBottom: '10px',
                  }"
                >
                  图数据库格式上传
                </div>
              </div>
            </a>
            <a @click="importRelationDatabaseData()">
              <div
                :style="{
                  border: '1px dashed',
                  textAlign: 'center',
                  width: '25%',
                  background: '#FFFFFF',
                  marginLeft: '15%',
                  marginTop: '10%',
                  display: 'inline-block',
                }"
              >
                <PlusOutlined
                  :style="{ marginTop: '10px', fontSize: '600%' }"
                ></PlusOutlined>
                <div
                  :style="{
                    color: '#2c3e50',
                    marginTop: '20px',
                    marginBottom: '10px',
                  }"
                >
                  关系型数据库上传
                </div>
              </div>
            </a>
          </div>
          <div
            v-if="importGraphDatabaseDataVision"
            :style="{ paddingTop: '100px', textAlign: 'center' }"
          >
            <div :style="{ minHeight: '400px' }">
              <div :style="{ width: '20%', display: 'inline-block' }">
                <a-upload-dragger
                  name="nodeFile"
                  :multiple="true"
                  :file-list="verticeFileList"
                  :remove="verticeFileHandleRemove"
                  :before-upload="verticeBeforeUpload"
                >
                  <p class="ant-upload-drag-icon">
                    <inbox-outlined></inbox-outlined>
                  </p>
                  <p class="ant-upload-text">点击或将文件拖拽到此处上传</p>
                  <p class="ant-upload-hint">此处仅上传顶点标签文件</p>
                </a-upload-dragger>
              </div>
              <div
                :style="{
                  width: '20%',
                  display: 'inline-block',
                  marginLeft: '4%',
                  verticalAlign: 'top',
                }"
              >
                <a-upload-dragger
                  name="nodeFile"
                  :multiple="true"
                  :file-list="edgeFileList"
                  :remove="edgeFileHandleRemove"
                  :before-upload="edgeBeforeUpload"
                >
                  <p class="ant-upload-drag-icon">
                    <inbox-outlined></inbox-outlined>
                  </p>
                  <p class="ant-upload-text">点击或将文件拖拽到此处上传</p>
                  <p class="ant-upload-hint">此处仅上传边标签文件</p>
                </a-upload-dragger>
              </div>
              <div
                :style="{
                  width: '20%',
                  display: 'inline-block',
                  marginLeft: '4%',
                  verticalAlign: 'top',
                }"
              >
                <a-upload-dragger
                  name="nodeFile"
                  :multiple="true"
                  :file-list="propertyFileList"
                  :remove="propertyFileHandleRemove"
                  :before-upload="propertyBeforeUpload"
                >
                  <p class="ant-upload-drag-icon">
                    <inbox-outlined></inbox-outlined>
                  </p>
                  <p class="ant-upload-text">点击或将文件拖拽到此处上传</p>
                  <p class="ant-upload-hint">此处仅上传属性值文件</p>
                </a-upload-dragger>
              </div>
            </div>
            <a-button
              type="primary"
              :disabled="
                verticeFileList.length === 0 &&
                edgeFileList.length === 0 &&
                propertyFileList.length === 0
              "
              :loading="uploading1"
              @click="handleUpload(1)"
            >
              {{ uploading1 ? "上传中" : "开始上传" }}
            </a-button>
          </div>
          <div
            v-if="importRelationDatabaseDataVision"
            :style="{
              marginLeft: '10%',
              marginTop: '40px',
              width: '80%',
              height: '80%',
            }"
          >
            <a-steps :current="current">
              <a-step
                v-for="item in steps"
                :key="item.title"
                :title="item.title"
              />
            </a-steps>
            <div class="steps-content">
              <div
                v-if="steps[current].content === '准备图格式'"
                :style="{ textAlign: 'center' }"
              >
                <div :style="{ display: 'inline-block', width: '95%' }">
                  <a-tabs default-active-key="1">
                    <a-tab-pane key="1" tab="顶点类型">
                      <a-button
                        @click="setInsertEntityVision()"
                        type="primary"
                        :style="{
                          float: 'right',
                          zIndex: '2',
                          marginBottom: '5px',
                        }"
                        >创建</a-button
                      >
                      <a-table
                        :columns="entityColumns"
                        :data-source="entityData"
                        :pagination="pagination"
                      >
                        <template #operation="{ text, record }">
                          <span
                            ><a
                              @click="
                                () => deleteEntity(text, record.key, record)
                              "
                              >删除</a
                            ></span
                          >
                        </template>
                      </a-table>
                    </a-tab-pane>
                    <a-tab-pane key="2" tab="边类型">
                      <a-button
                        @click="setInsertRelationVision()"
                        type="primary"
                        :style="{
                          float: 'right',
                          zIndex: '2',
                          marginBottom: '5px',
                        }"
                        >创建</a-button
                      >
                      <a-table
                        :columns="relationColumns"
                        :data-source="relationData"
                        :pagination="pagination"
                      >
                        <template #operation="{ text, record }">
                          <a
                            @click="
                              () => deleteRelation(text, record.key, record)
                            "
                            >删除</a
                          >
                        </template>
                      </a-table>
                    </a-tab-pane>
                  </a-tabs>
                </div>
              </div>
              <div
                v-if="steps[current].content === '上传文件'"
                :style="{ textAlign: 'center' }"
              >
                <div
                  :style="{
                    display: 'inline-block',
                    width: '40%',
                    marginTop: '5%',
                  }"
                >
                  <a-upload-dragger
                    name="nodeFile"
                    :multiple="true"
                    :file-list="fileList"
                    :remove="fileHandleRemove"
                    :before-upload="beforeUpload"
                  >
                    <p class="ant-upload-drag-icon">
                      <inbox-outlined></inbox-outlined>
                    </p>
                    <p class="ant-upload-text">点击或将文件拖拽到此处上传</p>
                    <p class="ant-upload-hint">支持json格式</p>
                  </a-upload-dragger>
                  <a-button
                    type="primary"
                    :disabled="fileList.length === 0"
                    :loading="uploading"
                    style="margin-top: 16px"
                    @click="handleUpload(2)"
                  >
                    {{ uploading ? "上传中" : "开始上传" }}
                  </a-button>
                </div>
              </div>
              <div v-if="steps[current].content === '设置映射'">
                <div
                  :style="{
                    display: 'inline-block',
                    width: '80%',
                    marginTop: '20px',
                    marginLeft: '20%',
                    verticalAlign: 'top',
                    textAlign: 'left',
                  }"
                >
                  <div
                    :style="{
                      marginBottom: '10px',
                      fontSize: '20px',
                      fontFamily: 'serif',
                    }"
                  >
                    设置实体映射：
                  </div>
                  <span :style="{ marginRight: '50px' }">选择实体标签:</span>
                  <a-select
                    show-search
                    placeholder="选择实体标签"
                    option-filter-prop="entityLabel"
                    style="width: 50%"
                    :filter-option="entityLabelFilterOption"
                    @change="entityLabelHandleChange"
                  >
                    <a-select-option
                      v-for="(vertice, index) in vertexlabels"
                      :key="index"
                      :value="vertice.name"
                      >{{ vertice.name }}({{
                        vertice.standardName
                      }})</a-select-option
                    >
                  </a-select>
                  <div></div>
                  <span
                    :style="{
                      display: 'inline-block',
                      marginRight: '50px',
                      marginTop: '50px',
                    }"
                    >选择映射文件:</span
                  >
                  <a-select
                    show-search
                    placeholder="选择映射文件"
                    option-filter-prop="entityFile"
                    style="width: 50%"
                    :filter-option="entityFileFilterOption"
                    @change="entityFileHandleChange"
                  >
                    <a-select-option
                      v-for="(file, index) in entityFile"
                      :key="index"
                      :value="file"
                      >{{ file }}</a-select-option
                    >
                  </a-select>
                  <a-button
                    @click="submitEntityMap()"
                    :style="{ marginLeft: '60%', marginTop: '50px' }"
                    type="primary"
                    :disabled="
                      selectedEntityLabel === '' || selectedEntityFile === ''
                    "
                  >
                    确定
                  </a-button>
                </div>
              </div>
              <div
                v-if="steps[current].content === '导入数据'"
                :style="{ textAlign: 'center', paddingTop: '10%' }"
              >
                <a-button @click="startImportData">开始导入</a-button>
                <a-progress
                  :style="{ width: '30%', marginLeft: '20px' }"
                  :percent="importDataProgress"
                />
              </div>
            </div>
            <div class="steps-action">
              <a-button
                v-if="current < steps.length - 1"
                type="primary"
                @click="next"
              >
                下一步
              </a-button>
              <a-button
                v-if="current > 0"
                style="margin-left: 8px"
                @click="prev"
              >
                上一步
              </a-button>
            </div>
          </div>
          <div
            v-show="knowledgeGraphVision"
            id="knowledgeGraph"
            :style="{
              marginTop: '20px',
            }"
          ></div>
          <div
            v-if="multipleJumpRoadVisible"
            :style="{ verticalAlign: 'bottom' }"
          >
            <div
              :style="{
                display: 'inline-block',
                fontSize: '25px',
                fontFamily: '宋体',
                verticalAlign: 'bottom',
              }"
            >
              路径:
            </div>
            <div
              id="multipleJumpRoad"
              :style="{
                width: '50%',
                height: '40px',
                display: 'inline-block',
                verticalAlign: 'bottom',
              }"
            ></div>
            <a-button
              type="primary"
              :style="{ display: 'inline-block', verticalAlign: 'top' }"
              @click="submitMultipleJumpSelectedEntity()"
            >
              提交
            </a-button>
          </div>

          <!-- 实体，属性，关系表-->
          <aliases-table
            :style="{ display: 'inline-block', width: '97%' }"
            v-if="aliasesTableVision"
            :data="aliasesTableData"
          ></aliases-table>

          <!--单实体模板 级联选择-->
          <div v-if="singleEntityCascaderVision" :style="{ marginTop: '5%' }">
            <a-cascader
              :options="singleEntityOptions"
              :show-search="{ singleEntityFilter }"
              placeholder="选择实体/选择属性/问题类型"
              @change="singleEntityOnChange"
              :style="{ width: '20%', textAlign: 'left' }"
            />
            <a-button
              type="primary"
              :style="{ marginLeft: '20px' }"
              @click="submitOptions"
              >提交</a-button
            >
          </div>

          <!--单跳模板 级联选择-->
          <div v-if="singleJumpCascaderVision" :style="{ marginTop: '5%' }">
            <a-cascader
              :options="singleJumpOptions"
              :show-search="{ singleJumpFilter }"
              placeholder="选择实体/选择关系/选择属性/问题类型"
              @change="singleJumpOnChange"
              :style="{ width: '25%', textAlign: 'left' }"
            />
            <a-button
              type="primary"
              :style="{ marginLeft: '20px' }"
              @click="submitOptions"
              >提交</a-button
            >
          </div>
          <!-- 数据导出 -->
          <export-data v-if="exportDataVision"></export-data>

          <!--模板-->
          <a-modal
            v-if="templateVision"
            v-model:visible="templateVision"
            :closable="false"
            width="70%"
            @ok="templateVision = false"
          >
            <question-template
              :data="templateTableDataSample"
              :key1="cascaderValue"
              :index="selectdTemplateIndex"
            ></question-template>
          </a-modal>

          <!--创建实体，关系-->
          <a-modal
            v-if="insertEntityVision"
            v-model:visible="insertEntityVision"
            @ok="insertEntity()"
            width="50%"
            :closable="false"
          >
            <a-form
              ref="ruleForm"
              :model="entityForm"
              :rules="entityRules"
              :label-col="labelCol"
              :wrapper-col="wrapperCol"
              :style="{ marginLeft: '10%' }"
            >
              <a-form-item ref="name" label="顶点类型名: " name="entityLabel">
                <a-input
                  v-model:value="entityForm.entityLabel"
                  placeholder="允许出现中英文，数字及下划线"
                />
              </a-form-item>
              <a-form-item label="顶点标准名: " name="standardName">
                <a-input
                  v-model:value="entityForm.standardName"
                  placeholder="允许与类型名一致"
                />
              </a-form-item>
              <a-form-item
                label="关联属性: "
                v-for="(property, index) in entityForm.properties"
                :key="index"
                :rules="{
                  required: true,
                  message: '不能为空',
                  trigger: 'change',
                }"
              >
                <a-input
                  v-model:value="property.name"
                  placeholder="请输入属性类型名"
                  style="width: 40%; margin-right: 8px"
                />
                <a-input
                  v-model:value="property.standardName"
                  placeholder="请输入属性标准名"
                  style="width: 40%; margin-right: 8px"
                />
                <MinusCircleOutlined
                  v-if="entityForm.properties.length > 0"
                  class="dynamic-delete-button"
                  @click="removeDomain(index)"
                />
              </a-form-item>
              <a-form-item>
                <a-button
                  type="dashed"
                  :style="{ marginLeft: '30%', width: '30%' }"
                  @click="addDomain"
                >
                  <PlusOutlined />
                  添加属性
                </a-button>
              </a-form-item>
            </a-form>
          </a-modal>
          <a-modal
            v-if="insertRelationVision"
            v-model:visible="insertRelationVision"
            @ok="insertRelation()"
            width="50%"
            :closable="false"
          >
            <a-form
              ref="ruleForm"
              :model="relationForm"
              :rules="relationRules"
              :label-col="labelCol"
              :wrapper-col="wrapperCol"
              :style="{ marginLeft: '10%' }"
            >
              <a-form-item ref="name" label="边类型名: " name="relationLabel">
                <a-input
                  v-model:value="relationForm.relationLabel"
                  placeholder="允许出现中英文，数字及下划线"
                />
              </a-form-item>
              <a-form-item
                ref="standardName"
                label="边标准名: "
                name="standardName"
              >
                <a-input
                  v-model:value="relationForm.standardName"
                  placeholder="允许与类型名一致"
                />
              </a-form-item>
              <a-form-item label="起点类型：" name="source_name">
                <a-select
                  v-model:value="relationForm.source_name"
                  placeholder="请选择起点类型"
                >
                  <a-select-option
                    v-for="(vertice, index) in vertexlabels"
                    :key="index"
                    :value="vertice.name"
                  >
                    {{ vertice.name }}({{ vertice.standardName }})
                  </a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item label="终点类型：" name="target_name">
                <a-select
                  v-model:value="relationForm.target_name"
                  placeholder="请选择终点类型"
                >
                  <a-select-option
                    v-for="(vertice, index) in vertexlabels"
                    :key="index"
                    :value="vertice.name"
                  >
                    {{ vertice.name }}({{ vertice.standardName }})
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-form>
          </a-modal>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </div>
</template>

<script>
import AliasesTable from "./AliasesTable.vue";
import reqwest from "reqwest";
import router from "../router/index";
import {
  MinusCircleOutlined,
  PlusOutlined,
  InboxOutlined,
} from "@ant-design/icons-vue";
import ExportData from "./ExportData.vue";
import QuestionTemplate from "./Template";
import axios from "../utils/request";

const entityColumns = [
  {
    title: "顶点类型名",
    dataIndex: "name",
    key: "name",
    scopedSlots: { customRender: "name" },
    width: "25%",
    ellipsis: true,
  },
  {
    title: "标准名",
    dataIndex: "standardName",
    key: "standardName",
    width: "25%",
    ellipsis: true,
  },
  {
    title: "关联属性",
    dataIndex: "properties",
    key: "properties",
    width: "40%",
    ellipsis: true,
  },
  {
    title: "操作",
    dataIndex: "delete",
    slots: { customRender: "operation" },
    ellipsis: true,
  },
];
const entityData = [];
const relationColumns = [
  {
    title: "边类型名称",
    dataIndex: "name",
    key: "name",
    scopedSlots: { customRender: "name" },
    width: "20%",
    ellipsis: true,
  },
  {
    title: "标准名",
    dataIndex: "standardName",
    key: "standardName",
    width: "20%",
    ellipsis: true,
  },
  {
    title: "起点类型",
    dataIndex: "source_name",
    key: "source_name",
    width: "25%",
    ellipsis: true,
  },
  {
    title: "终点类型",
    dataIndex: "target_name",
    key: "target_name",
    width: "25%",
    ellipsis: true,
  },
  {
    title: "操作",
    dataIndex: "delete",
    slots: { customRender: "operation" },
    ellipsis: true,
  },
];
const relationData = [];
const labelCol = { span: 4 };
const wrapperCol = { span: 14 };
var knowledgeGraph = "";

export default {
  name: "Home",
  props: {},
  data() {
    return {
      knowledgeGraphVision: true,
      insertEntityVision: false,
      insertRelationVision: false,
      importRelationDatabaseDataVision: false,
      aliasesTableVision: false,
      importDataVision: false,
      tableVisible: false,
      importGraphDatabaseDataVision: false,
      exportDataVision: false,
      singleEntityCascaderVision: false,
      singleJumpCascaderVision: false,
      templateVision: false,

      // 图数据库上传文件
      verticeFileList: [],
      edgeFileList: [],
      propertyFileList: [],

      pagination: {
        pageSize: 6,
      },
      labelCol,
      wrapperCol,
      entityForm: {
        entityLabel: "",
        standardName: "",
        properties: [],
      },
      // form表单验证规则，还未成功
      entityRules: {
        entityLabel: [
          {
            type: "string",
            required: true,
            message: "请输入顶点类型名",
            trigger: "blur",
          },
          {
            type: "string",
            min: 1,
            max: 20,
            message: "类型名长度在1到20之间",
            trigger: "blur",
          },
        ],
        standardName: [
          {
            type: "string",
            required: true,
            message: "请输入顶点标准名",
            trigger: "blur",
          },
          {
            type: "string",
            min: 1,
            max: 20,
            message: "标准名长度在1到20之间",
            trigger: "blur",
          },
        ],
      },
      relationForm: {
        relatonLabel: "",
        source_name: [],
        target_name: [],
      },
      entityColumns,
      entityData,
      relationColumns,
      relationData,
      fileList: [],
      uploading: false,
      uploading1: false,
      labelMatchingTableData: [],
      labelMatchingTableDataPropertylabel: [], // 对属性标签去重
      templateTableData: [],
      tableData: [],
      editingKey: "",
      tableShow: false,
      vertexlabels: [],
      propertykey: [],
      edgelabels: [],
      treeData: [
        {
          title: "同名词构建",
          key: "0",
          children: [
            {
              title: "实体",
              key: "0-0",
              children: [],
            },
            {
              title: "关系",
              key: "0-1",
              children: [],
            },
          ],
        },
        {
          title: "模板生成",
          key: "1",
          children: [
            {
              title: "单实体模板",
              key: "1-1",
              children: [],
            },
            {
              title: "单跳模板",
              key: "1-2",
              children: [],
            },
            {
              title: "多跳模板",
              key: "1-3",
              children: [],
            },
          ],
        },
        {
          title: "图谱结构",
          key: "2",
          children: [],
        },
        {
          title: "数据导入",
          key: "3",
          children: [],
        },
        {
          title: "数据导出",
          key: "4",
          children: [],
        },
      ],
      expandedKeys: ["0", "0-0", "0-1", "1"],
      selectedKeys: [],
      page: "",
      ifLoadMultipleJumpTemplate: false,
      multipleJumpLastSelectedNode: {
        name: "",
        x: "",
      },
      multipleJumpSelectedNode: [],
      multipleJumpSelectedNodeLink: [],
      multipleJumpRoadVisible: false,
      aliasesTableData: [],
      current: 0,
      steps: [
        {
          title: "准备图格式",
          content: "准备图格式",
        },
        {
          title: "上传文件",
          content: "上传文件",
        },
        {
          title: "设置映射",
          content: "设置映射",
        },
        {
          title: "导入数据",
          content: "导入数据",
        },
      ],
      entityTagsLength: 2, // 一开始的length，index在0～（length-1）的tag无法被删除，只有新添加的tag可以被删除
      entityTags: ["1", "2"],
      entityInputVisible: false,
      entityInputValue: "",
      entityFile: [],
      selectedEntityLabel: "",
      selectedEntityFile: "",
      selectedEntityMap: [],
      importDataProgress: 0,

      singleEntityOptions: [], // 单实体模板 级联选择项
      singleJumpOptions: [], // 单跳模板 级联选择项
      cascaderValue: "",
      templateTableDataSample: [],
      selectdTemplateIndex: "",
    };
  },
  methods: {
    submitMultipleJumpSelectedEntity() {
      this.templateTableData.splice(0, this.templateTableData.length);
      var multipleJumpTemplate = [];
      multipleJumpTemplate.push(this.multipleJumpSelectedNode[0].name);
      for (var j = 1; j < this.multipleJumpSelectedNode.length; j++) {
        var tmp = [];
        for (var i = 0; i < this.edgelabels.length; i++) {
          if (
            this.edgelabels[i].source_name ==
              this.multipleJumpSelectedNode[j - 1].name &&
            this.edgelabels[i].target_name ==
              this.multipleJumpSelectedNode[j].name
          ) {
            for (var n = 0; n < multipleJumpTemplate.length; n++) {
              tmp.push(
                multipleJumpTemplate[n] +
                  "  " +
                  this.edgelabels[i].name +
                  "  " +
                  this.edgelabels[i].target_name
              );
            }
          }
        }
        multipleJumpTemplate = tmp;
      }
      for (i = 0; i < multipleJumpTemplate.length; i++) {
        this.templateTableData.push({
          key: multipleJumpTemplate[i],
          template: multipleJumpTemplate[i],
        });
      }
    },
    close() {
      (this.knowledgeGraphVision = true),
        (this.insertEntityVision = false),
        (this.insertRelationVision = false),
        (this.importRelationDatabaseDataVision = false),
        (this.aliasesTableVision = false),
        (this.importDataVision = false),
        (this.tableVisible = false);
      this.importGraphDatabaseDataVision = false;
      this.exportDataVision = false;
      this.multipleJumpRoadVisible = false;
      (this.singleEntityCascaderVision = false),
        (this.singleJumpCascaderVision = false);
      this.templateVision = false;
    },

    // 数据导入
    importGraphDatabaseData() {
      this.close();
      this.knowledgeGraphVision = false;
      this.$nextTick(() => {
        this.importGraphDatabaseDataVision = true;
      });
    },
    importRelationDatabaseData() {
      this.close();
      this.knowledgeGraphVision = false;
      this.$nextTick(() => {
        this.importRelationDatabaseDataVision = true;
      });
    },
    next() {
      this.current++;
    },
    prev() {
      this.current--;
    },
    importData() {
      entityData.length = 0;
      relationData.length = 0;
      this.close();
      this.knowledgeGraphVision = false;
      this.loadGraph();
      for (let i = 0; i < this.vertexlabels.length; i++) {
        let entity = {
          key: this.vertexlabels[i].name,
          name: this.vertexlabels[i].name,
          standardName: this.vertexlabels[i].standardName,
          properties: "",
        };
        let properties = "";
        for (let j = 0; j < this.vertexlabels[i].properties.length; j++) {
          properties += this.vertexlabels[i].properties[j].name + ";";
        }

        properties = properties.slice(0, properties.length - 1);
        entity.properties = properties;
        entityData.push(entity);
      }
      for (let i = 0; i < this.edgelabels.length; i++) {
        let relation = {
          key: this.edgelabels[i].name,
          name: this.edgelabels[i].name,
          standardName: this.edgelabels[i].standardName,
          source_name: this.edgelabels[i].source_name,
          target_name: this.edgelabels[i].target_name,
        };
        relationData.push(relation);
      }
      this.$nextTick(() => {
        this.importDataVision = true;
      });
    },
    setInsertEntityVision() {
      this.insertEntityVision = true;
    },
    setInsertRelationVision() {
      this.insertRelationVision = true;
    },
    addDomain() {
      this.entityForm.properties.push({
        name: "",
        standardName: "",
      });
    },
    removeDomain(index) {
      this.entityForm.properties.splice(index, 1);
    },
    insertEntity() {
      if (this.entityForm.entityLabel === "") {
        this.$message.error("标签名不允许为空");
      } else {
        // entityData 传入this.entityData,更新表格
        let entityData = {
          key: this.entityForm.entityLabel,
          name: this.entityForm.entityLabel,
          standardName: this.entityForm.standardName,
          properties: "",
        };
        let entity = {
          name: this.entityForm.entityLabel,
          standardName: this.entityForm.standardName,
          aliases: { isEditable: false, tag: [] },
        };
        let property = [];
        if (this.entityForm.properties.length === 0) {
          property.push({
            name: "",
            standardName: "",
            aliases: { isEditable: false, tag: [] },
          });
        } else {
          for (let i = 0; i < this.entityForm.properties.length; i++) {
            property.push({
              name: this.entityForm.properties[i].name,
              standardName: this.entityForm.properties[i].standardName,
              aliases: { isEditable: false, tag: [] },
            });
            entityData.properties += this.entityForm.properties[i].name + ";";
          }
          entityData.properties = entityData.properties.slice(
            0,
            entityData.properties.length - 1
          );
        }
        let data = {
          entity: entity,
          property: property,
        };
        axios.post("/insertEntityPropertyLabelTable", data).then((response) => {
          if (response.status === 200) {
            this.entityData.push(entityData);
            this.$message.success(this.entityForm.entityLabel + "顶点创建成功");
            this.entityForm = {
              entityLabel: "",
              standardName: "",
              properties: [],
            };
            this.loadGraph();
            this.insertEntityVision = false;
          } else {
            this.$message.error(this.entityForm.entityLabel + "顶点创建失败");
          }
        });
      }
    },
    insertRelation() {
      if (this.relationForm.relationLabel === "") {
        this.$message.error("标签名不允许为空！");
      } else if (
        this.relationForm.source_name === this.relationForm.target_name
      ) {
        this.$message.error("起点类型不允许与终点类型一致！");
      } else {
        let relationData = {
          key: this.relationForm.relationLabel,
          name: this.relationForm.relationLabel,
          standardName: this.relationForm.standardName,
          source_name: this.relationForm.source_name,
          target_name: this.relationForm.target_name,
        };
        let data = {
          name: this.relationForm.relationLabel,
          standardName: this.relationForm.standardName,
          aliases: { isEditable: false, tag: [] },
          source_name: this.relationForm.source_name,
          target_name: this.relationForm.target_name,
        };
        axios.post("/insertRelationLabelTable", data).then((response) => {
          if (response.status === 200) {
            this.relationData.push(relationData);
            this.$message.success(
              this.relationForm.relationLabel + "边创建成功"
            );
            this.relationForm = {
              relationLabel: "",
              standardName: "",
              source_name: "",
              target_name: "",
            };
            this.loadGraph();
            this.insertRelationVision = false;
          } else {
            this.$message.success(
              this.relationForm.relationLabel + "边创建失败！"
            );
          }
        });
      }
    },
    deleteEntity(text, key, record) {
      axios.post("/removeEntity", record.name).then((response) => {
        if (response.status === 200) {
          for (let i = 0; i < this.entityData.length; i++) {
            if (this.entityData[i].name === record.name) {
              this.entityData.splice(i, 1);
              break;
            }
          }
          this.loadGraph();
          this.$message.success("顶点删除成功");
        } else {
          this.$message.error("顶点删除失败");
        }
      });
    },
    deleteRelation(text, key, record) {
      axios.post("/removeRelation", record.name).then((response) => {
        if (response.status === 200) {
          for (let i = 0; i < this.relationData.length; i++) {
            if (this.relationData[i].name === record.name) {
              this.relationData.splice(i, 1);
              break;
            }
          }
          this.loadGraph();
          this.$message.success("边删除成功");
        } else {
          this.$message.error("边删除失败");
        }
      });
    },
    // 文件上传
    fileHandleRemove(file) {
      const index = this.fileList.indexOf(file);
      const newFileList = this.fileList.slice();
      newFileList.splice(index, 1);
      this.fileList = newFileList;
    },
    beforeUpload(file) {
      this.fileList = [...this.fileList, file];
      return false;
    },
    handleUpload(flag) {
      if (flag === 1) {
        const { verticeFileList, edgeFileList, propertyFileList } = this;
        const formData = new FormData();
        if (verticeFileList.length !== 0) {
          verticeFileList.forEach((file) => {
            formData.append(file.name, file);
          });
          var i = 0;
          this.uploading1 = true;
          reqwest({
            url: "http://10.1.13.142:18081/hugeGraphInsertHugeVertexLabels",
            method: "post",
            processData: false,
            data: formData,
            success: () => {
              this.verticeFileList = [];
              this.$message.success("顶点标签文件上传成功.");
              i++;
              if (i === 3) {
                this.uploading1 = false;
              }
            },
            error: () => {
              i++;
              if (i === 3) {
                this.uploading1 = false;
              }
              this.$message.error("顶点标签文件上传失败");
            },
          });
        }
        if (edgeFileList.length !== 0) {
          const formData1 = new FormData();
          edgeFileList.forEach((file) => {
            formData1.append(file.name, file);
          });
          reqwest({
            url: "http://10.1.13.142:18081/hugeGraph/insertHugeEdgeLabels",
            method: "post",
            processData: false,
            data: formData1,
            success: () => {
              this.edgeFileList = [];
              i++;
              if (i == 3) this.uploading1 = false;
              this.$message.success("边标签文件上传成功");
            },
            error: () => {
              i++;
              if (i === 3) {
                this.uploading1 = false;
              }
              this.$message.error("边标签文件上传失败");
            },
          });
        }
        if (propertyFileList.length !== 0) {
          const formData2 = new FormData();
          propertyFileList.forEach((file) => {
            formData2.append(file.name, file);
          });
          reqwest({
            url: "http://10.1.13.142:18081/hugeGraph/insertHugeVertices",
            method: "post",
            processData: false,
            data: formData2,
            success: () => {
              this.propertyFileList = [];
              i++;
              if (i === 3) {
                this.uploading1 = false;
              }
              this.$message.success("属性值文件上传成功");
            },
            error: () => {
              i++;
              if (i === 3) {
                this.uploading1 = false;
              }
              this.$message.error("属性值文件上传失败");
            },
          });
        }
      } else {
        const { fileList } = this;
        const formData = new FormData();
        fileList.forEach((file) => {
          formData.append(file.name, file);
        });
        this.uploading = true;
        reqwest({
          url: "http://10.1.13.142:18081/relationDatabaseInsertPropertyFile",
          method: "post",
          processData: false,
          data: formData,
          success: (response) => {
            this.entityFile = [];
            for (let i = 0; i < response.name.length; i++)
              this.entityFile.push(response.name[i]);
            this.fileList = [];
            this.uploading = false;
            this.$message.success("upload successfully.");
          },
          error: () => {
            this.uploading = false;
            this.$message.error("upload failed.");
          },
        });
      }
    },
    verticeFileHandleRemove(file) {
      const index = this.verticeFileList.indexOf(file);
      const newFileList = this.verticeFileList.slice();
      newFileList.splice(index, 1);
      this.verticeFileList = newFileList;
    },
    verticeBeforeUpload(file) {
      this.verticeFileList = [...this.verticeFileList, file];
      return false;
    },
    edgeFileHandleRemove(file) {
      const index = this.edgeFileList.indexOf(file);
      const newFileList = this.edgeFileList.slice();
      newFileList.splice(index, 1);
      this.edgeFileList = newFileList;
    },
    edgeBeforeUpload(file) {
      this.edgeFileList = [...this.edgeFileList, file];
      return false;
    },
    propertyFileHandleRemove(file) {
      const index = this.propertyFileList.indexOf(file);
      const newFileList = this.propertyFileList.slice();
      newFileList.splice(index, 1);
      this.propertyFileList = newFileList;
    },
    propertyBeforeUpload(file) {
      this.propertyFileList = [...this.propertyFileList, file];
      return false;
    },

    // 处理4个下拉列表
    entityLabelHandleChange(value) {
      this.selectedEntityLabel = value;
    },
    entityLabelFilterOption(input, option) {
      return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    },
    entityFileHandleChange(value) {
      this.selectedEntityFile = value;
    },
    entityFileFilterOption(input, option) {
      return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    },
    // 保存映射     ***
    submitEntityMap() {
      for (let i = 0; i < this.selectedEntityMap.length; i++) {
        if (
          this.selectedEntityMap[i].selectedEntityLabel ===
          this.selectedEntityLabel
        ) {
          this.$message.error("该标签已添加映射");
          return;
        } else if (
          this.selectedEntityMap[i].selectedEntityFile ===
          this.selectedEntityFile
        ) {
          this.$message.error("该文件已添加映射");
          return;
        } else {
          this.selectedEntityMap.push({
            selectedEntityLabel: this.selectedEntityLabel,
            selectedEntityFile: this.selectedEntityFile,
          });
          this.$message.success("映射添加成功");
        }
      }
    },

    // 开始数据导入
    startImportData() {
      let fileQuantity = this.selectedEntityMap.length;
      let progress = 100 / fileQuantity;
      let that = this;
      for (let i = 0; i < this.selectedEntityMap.length; i++) {
        console.log(this.selectedEntityMap[i]);
        axios
          .post("/relationDatabaseWritePropertiesFile", {
            entity: this.selectedEntityMap[i].selectedEntityLabel,
            fileName: this.selectedEntityMap[i].selectedEntityFile,
          })
          .then((response) => {
            this.importDataProgress += progress;
            if (response.status === 200) {
              that.$message.success(
                this.selectedEntityMap[i].selectedEntityFile + "导入成功"
              );
            } else {
              that.$message.error(
                this.selectedEntityMap[i].selectedEntityFile + "导入失败"
              );
            }
          });
      }
    },
    // 单实体模板 级联选择方法
    singleEntityOnChange(value) {
      this.cascaderValue = value[0] + "-" + value[1] + "-" + value[2];
      this.selectdTemplateIndex = 1;
      //console.log(value, selectedOptions);
    },
    singleEntityFilter(inputValue, path) {
      return path.some(
        (option) =>
          option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
      );
    },
    loadSingleEntityOptionsData() {
      this.singleEntityOptions.splice(0, this.singleEntityOptions.length);
      for (var i = 0; i < this.vertexlabels.length; i++) {
        this.singleEntityOptions.push({
          value: this.vertexlabels[i].name,
          label: this.vertexlabels[i].name,
          children: [],
        });
        for (let j = 0; j < this.vertexlabels[i].properties.length; j++) {
          let value = this.vertexlabels[i].properties[j].name;
          this.singleEntityOptions[i].children.push({
            value: value,
            label: value,
            children: [],
          });
          this.singleEntityOptions[i].children[j].children.push({
            value: "查找实体",
            label: "查找实体",
          });
          this.singleEntityOptions[i].children[j].children.push({
            value: "查找属性",
            label: "查找属性",
          });
          this.singleEntityOptions[i].children[j].children.push({
            value: "比较问题",
            label: "比较问题",
          });
          this.singleEntityOptions[i].children[j].children.push({
            value: "判断问题",
            label: "判断问题",
          });
          this.singleEntityOptions[i].children[j].children.push({
            value: "计数问题",
            label: "计数问题",
          });
        }
      }
    },
    submitOptions() {
      this.templateTableDataSample.splice(
        0,
        this.templateTableDataSample.length
      );
      if (this.selectdTemplateIndex === 1) this.loadSingleEntityTemplate();
      else if (this.selectdTemplateIndex === 2) this.loadSingleJumpTemplate();
      var that = this;
      setTimeout(function () {
        for (let i = 0; i < that.templateTableData.length; i++) {
          if (that.templateTableData[i].key === that.cascaderValue) {
            that.templateTableDataSample.push({
              index: that.templateTableData[i].index,
              key:
                that.templateTableData[i].key +
                (that.templateTableDataSample.length < 10
                  ? "0" + that.templateTableDataSample.length
                  : that.templateTableDataSample.length),
              template: that.templateTableData[i].template,
            });
          }
        }
        that.templateVision = true;
      }, 500);
    },

    // 单跳模板 级联选择方法
    singleJumpOnChange(value) {
      this.cascaderValue =
        value[0] + "-" + value[1] + "-" + value[2] + "-" + value[3];
      this.selectdTemplateIndex = 2;
    },
    singleJumpFilter(inputValue, path) {
      return path.some(
        (option) =>
          option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
      );
    },
    loadSingleJumpOptionsData() {
      this.singleJumpOptions.splice(0, this.singleJumpOptions.length);
      for (var i = 0; i < this.vertexlabels.length; i++) {
        this.singleJumpOptions.push({
          value: this.vertexlabels[i].name,
          label: this.vertexlabels[i].name,
          children: [],
        });
        for (var j = 0; j < this.edgelabels.length; j++) {
          if (this.edgelabels[j].source_name === this.vertexlabels[i].name) {
            this.singleJumpOptions[i].children.push({
              value: this.edgelabels[j].name,
              label: this.edgelabels[j].name,
              children: [],
            });
            for (var n = 0; n < this.vertexlabels.length; n++) {
              if (
                this.vertexlabels[n].name === this.edgelabels[j].target_name
              ) {
                for (
                  var q = 0;
                  q < this.vertexlabels[n].properties.length;
                  q++
                ) {
                  this.singleJumpOptions[i].children[
                    this.singleJumpOptions[i].children.length - 1
                  ].children.push({
                    value: this.vertexlabels[n].properties[q].name,
                    label: this.vertexlabels[n].properties[q].name,
                    children: [],
                  });
                  this.singleJumpOptions[i].children[
                    this.singleJumpOptions[i].children.length - 1
                  ].children[q].children.push({
                    value: "查找属性",
                    label: "查找属性",
                  });
                  this.singleJumpOptions[i].children[
                    this.singleJumpOptions[i].children.length - 1
                  ].children[q].children.push({
                    value: "查找实体",
                    label: "查找实体",
                  });
                  this.singleJumpOptions[i].children[
                    this.singleJumpOptions[i].children.length - 1
                  ].children[q].children.push({
                    value: "判断问题",
                    label: "判断问题",
                  });
                  this.singleJumpOptions[i].children[
                    this.singleJumpOptions[i].children.length - 1
                  ].children[q].children.push({
                    value: "比较问题",
                    label: "比较问题",
                  });
                  this.singleJumpOptions[i].children[
                    this.singleJumpOptions[i].children.length - 1
                  ].children[q].children.push({
                    value: "计数问题",
                    label: "计数问题",
                  });
                }
                break;
              }
            }
          }
        }
      }
    },

    turnToTemplate() {
      // this.$store.commit("pushTemplateTableData", this.templateTableData);
      router.push({
        name: "navigate",
      });
    },
    loadTemplate(response, index) {
      this.templateTableData.splice(0, this.templateTableData.length);
      for (var i = 0; i < response.data.length; i++) {
        for (var j = 0; j < response.data[i][1].length; j++) {
          this.templateTableData.push({
            key: response.data[i][0],
            template: response.data[i][1][j],
            index: index,
          });
        }
      }
      //this.turnToTemplate();
    },
    loadSingleEntityTemplate() {
      axios
        .get("/OneEntity")
        .then((response) => {
          this.loadTemplate(response, 1);
        })
        .catch((error) => {
          console.log(error);
          this.errored = true;
        });
    },
    loadSingleJumpTemplate() {
      axios
        .get("/TwoEntity")
        .then((response) => {
          this.loadTemplate(response, 2);
        })
        .catch((error) => {
          console.log(error);
          this.errored = true;
        });
    },
    loadMultipleJumpTemplate() {
      this.close();
      this.ifLoadMultipleJumpTemplate = true;
    },
    onSelect(selectedKeys, info) {
      this.ifLoadMultipleJumpTemplate = false;
      var selectedTitle = info.node.dataRef.title;
      var selectedNode;
      this.knowledgeGraphVision = true;
      /**if (selectedTitle !== "数据导入" && this.importDataVision == true) {
        this.importDataVision = false;
        this.$nextTick(() => {
          this.draw();
        });
      }**/
      if (
        selectedTitle == "同名词构建" ||
        selectedTitle == "实体" ||
        selectedTitle == "关系" ||
        selectedTitle == "模板生成"
      ) {
        this.close();
        return;
      } else if (selectedTitle == "单实体模板") {
        this.loadSingleEntityOptionsData();
        this.$nextTick(() => {
          this.close();
          this.knowledgeGraphVision = false;
          this.singleEntityCascaderVision = true;
        });
      } else if (selectedTitle == "单跳模板") {
        this.loadSingleJumpOptionsData();
        this.$nextTick(() => {
          this.close();
          this.knowledgeGraphVision = false;
          this.singleJumpCascaderVision = true;
        });
      } else if (selectedTitle == "多跳模板") {
        this.close();
        this.$nextTick(() => {
          this.loadMultipleJumpTemplate();
        });
      } else if (selectedTitle == "数据导入") {
        this.importData();
      } else if (selectedTitle == "数据导出") {
        this.close();
        this.exportAllData();
        //this.setExportDataVision();
      } else if (selectedTitle == "图谱结构") {
        this.close();
        if (
          knowledgeGraph != null &&
          knowledgeGraph != "" &&
          knowledgeGraph != undefined
        ) {
          knowledgeGraph.dispose(); //解决echarts dom已经加载的报错
        }
        this.draw();
      } else {
        this.loadGraph();
        this.aliasesTableData.splice(0, this.aliasesTableData.length);
        if (selectedKeys[0].charAt(0) == 0) {
          for (var n = 0; n < this.vertexlabels.length; n++)
            if (this.vertexlabels[n].name == selectedTitle) {
              selectedNode = this.vertexlabels[n];
              break;
            }
          this.aliasesTableData.push({
            index: 0,
            key: "0-" + selectedNode.name,
            name: selectedNode.name,
            standardName: selectedNode.standardName,
            aliases: selectedNode.aliases,
          });
          for (var i = 0; i < selectedNode.properties.length; i++) {
            if (selectedNode.properties[i].name === "") break;
            this.aliasesTableData.push({
              index: this.aliasesTableData.length,
              key: "0-" + selectedTitle + "-" + selectedNode.properties[i].name,
              name: selectedNode.properties[i].name,
              standardName: selectedNode.properties[i].standardName,
              aliases: selectedNode.properties[i].aliases,
            });
          }
        } else if (selectedKeys[0].charAt(0) == 1) {
          for (n = 0; n < this.edgelabels.length; n++)
            if (this.edgelabels[n].name == selectedTitle) {
              selectedNode = this.edgelabels[n];
              break;
            }
          this.aliasesTableData.push({
            index: this.aliasesTableData.length,
            key: "1-" + selectedNode.name,
            name: selectedNode.name,
            standardName: selectedNode.standardName,
            aliases: selectedNode.aliases,
            source_name: selectedNode.source_name,
            target_name: selectedNode.target_name,
          });
        }
        this.close();
        this.knowledgeGraphVision = false;
        this.$nextTick(() => {
          this.aliasesTableVision = true;
        });
      }
    },
    loadGraph() {
      //ES6 新建一个Promise对象。resolve函数表示操作成功，reject
      return new Promise((resolve) => {
        // 加载实体，属性，边数据
        axios
          .get("/loadEntityPropertyLabel")
          .then((response) => {
            this.vertexlabels = [];
            this.treeData[0].children[0].children = [];
            for (var i = 0; i < response.data.length; i++) {
              this.vertexlabels.push({
                key: response.data[i].entity.name,
                name: response.data[i].entity.name,
                standardName: response.data[i].entity.standardName,
                aliases: response.data[i].entity.aliases,
                properties: response.data[i].property,
              });
              this.treeData[0].children[0].children.push({
                title: response.data[i].entity.name,
                key: "0-" + response.data[i].entity.name,
                children: [],
              });
            }
          })
          .catch((error) => {
            console.log(error);
            this.errored = true;
          });
        axios
          .get("/loadRelationLabel")
          .then((response) => {
            this.edgelabels = [];
            this.treeData[0].children[1].children = [];
            for (var i = 0; i < response.data.length; i++) {
              this.edgelabels.push({
                key: response.data[i].name,
                name: response.data[i].name,
                standardName: response.data[i].standardName,
                aliases: response.data[i].aliases,
                source_name: response.data[i].source_name,
                target_name: response.data[i].target_name,
              });
              this.treeData[0].children[1].children.push({
                title: response.data[i].name,
                key: "1-" + response.data[i].name,
                children: [],
              });
            }
            resolve();
          })
          .catch((error) => {
            console.log(error);
            this.errored = true;
          });
      });
    },
    drawMultipleJumpRoad() {
      var multipleJumpRoad;
      this.close();
      this.multipleJumpRoadVisible = true;
      this.$nextTick(() => {
        multipleJumpRoad = this.$echarts.init(
          document.getElementById("multipleJumpRoad")
        );
        var options = {
          series: [
            {
              type: "graph",
              layout: "none",
              label: {
                show: true,
              },
              edgeSymbol: ["circle", "arrow"],
              edgeLabel: {
                fontSize: 20,
              },
              data: this.multipleJumpSelectedNode,
              // links: [],
              links: this.multipleJumpSelectedNodeLink,
              lineStyle: {
                opacity: 0.9,
                width: 2,
              },
            },
          ],
        };
        multipleJumpRoad.setOption(options);
      });
    },
    draw() {
      var that = this;
      return new Promise((resolve) => {
        document.getElementById("knowledgeGraph").style.width =
          window.innerWidth * 0.8 + "px";
        document.getElementById("knowledgeGraph").style.height =
          window.innerHeight * 0.9 + "px";
        knowledgeGraph = this.$echarts.init(
          document.getElementById("knowledgeGraph")
        );
        knowledgeGraph.resize();
        var categories = [];
        var data = [];
        var links = [];
        for (var i = 0; i < that.vertexlabels.length; i++) {
          categories[i] = {
            name: this.vertexlabels[i].name,
          };
          data[i] = {
            name: this.vertexlabels[i].name,
            x: Math.random() * 400 + 300,
            y: Math.random() * 400 + 300,
            symbolSize: Math.random() * 20 + 35,
            value: this.vertexlabels[i].name,
          };
        }
        for (i = 0; i < this.edgelabels.length; i++) {
          links[i] = {
            name: this.edgelabels[i].name,
            source: this.edgelabels[i].source_name,
            target: this.edgelabels[i].target_name,
          };
        }
        var graph = { nodes: data };
        graph.nodes.forEach(function (node) {
          node.category = node.name;
          node.draggable = true;
        });
        var options = {
          tooltip: {},
          legend: [
            {
              // selectedMode: 'single',
              data: categories.map(function (a) {
                return a.name;
              }),
            },
          ],
          animationDuration: 1500,
          animationEasingUpdate: "quinticInOut",
          series: [
            {
              type: "graph",
              layout: "force",
              data: data,
              links: links,
              categories: categories,
              edgeSymbol: ["circle", "arrow"],
              roam: false,
              label: {
                show: true,
              },
              force: {
                repulsion: 100,
              },
              lineStyle: {
                width: 1.5,
              },
            },
          ],
        };
        knowledgeGraph.on("click", function (params) {
          if (that.ifLoadMultipleJumpTemplate == true) {
            if (that.multipleJumpLastSelectedNode.name == "") {
              that.multipleJumpLastSelectedNode = {
                name: params.data.name,
                x: 250,
                y: 700,
                symbolSize: 40,
                value: params.data.name,
              };
              that.multipleJumpSelectedNode.push(
                that.multipleJumpLastSelectedNode
              );
              return;
            }
            for (var i = 0; i < that.edgelabels.length; i++) {
              if (
                that.edgelabels[i].source_name ==
                  that.multipleJumpLastSelectedNode.name &&
                that.edgelabels[i].target_name == params.data.name
              ) {
                that.multipleJumpRoadVisible = false;
                that.multipleJumpSelectedNodeLink.push({
                  source: that.multipleJumpLastSelectedNode.name,
                  target: params.data.name,
                });
                console.log(that.multipleJumpLastSelectedNode);
                that.multipleJumpLastSelectedNode = {
                  name: params.data.name,
                  x: that.multipleJumpLastSelectedNode.x + 500,
                  y: 700,
                  symbolSize: 40,
                  value: params.data.name,
                };
                that.multipleJumpSelectedNode.push(
                  that.multipleJumpLastSelectedNode
                );
                that.$nextTick(() => {
                  that.drawMultipleJumpRoad();
                });

                return;
              }
            }
          } else if (that.selectedKeys[0] === "2") {
            // 2 为Tree中 图谱结构的key
            that.selectedKeys = [];
            if (params.dataType === "node")
              that.selectedKeys.push("0-" + params.data.name);
            else that.selectedKeys.push("1-" + params.data.name);
          }
        }),
          knowledgeGraph.setOption(options);
        resolve();
      });
    },
    loadData() {
      Promise.all([this.loadGraph()]).then(() => {
        this.draw();
      });
    },
    setExportDataVision() {
      this.close();
      this.knowledgeGraphVision = false;
      this.exportDataVision = true;
    },
    exportAllData() {
      this.$confirm({
        title: "是否导出全部数据文件",
        content: "",
        onOk() {
          var elemIF = document.createElement("iframe");
          elemIF.src = " http://10.1.13.142:18081/entityFile";
          elemIF.style.display = "none";
          document.body.appendChild(elemIF);
          var elemIF1 = document.createElement("iframe");
          elemIF1.src = " http://10.1.13.142:18081/dictionaryFile";
          elemIF1.style.display = "none";
          document.body.appendChild(elemIF1);
          var elemIF2 = document.createElement("iframe");
          elemIF2.src = " http://10.1.13.142:18081/templateFile";
          elemIF2.style.display = "none";
          document.body.appendChild(elemIF2);
        },
        onCancel() {
          console.log("Cancel");
        },
        class: "test",
      });
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.loadData();
    });
  },
  components: {
    "aliases-table": AliasesTable,
    MinusCircleOutlined,
    PlusOutlined,
    InboxOutlined,
    "export-data": ExportData,
    "question-template": QuestionTemplate,
  },
};
</script>
<style scoped>
.steps-content {
  margin-top: 16px;
  border: 1px dashed #e9e9e9;
  border-radius: 6px;
  background-color: #ffffff;
  min-height: 350px;
}

.steps-action {
  margin-top: 24px;
}
.dynamic-delete-button {
  cursor: pointer;
  position: relative;
  top: 4px;
  font-size: 24px;
  color: #999;
  transition: all 0.3s;
}
.dynamic-delete-button:hover {
  color: #777;
}
.dynamic-delete-button[disabled] {
  cursor: not-allowed;
  opacity: 0.5;
}
#logoStyle {
  vertical-align: middle;
  font-size: 23px;
  font-family: "微软雅黑", "Heiti SC", "文泉驿正黑体", "黑体", "Sans-serif";
  margin-left: 10px;
  color: rgba(0, 0, 0, 0.65);
}
</style>
