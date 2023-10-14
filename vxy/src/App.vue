<template>
  <div class="common-layout">
    <el-container>
      <div class="head">
        <!-- 顶部固定题目 -->
        <div class="que">{{ question }}</div>
      </div>
      <el-main>
        <div v-if="showAnswerValue" class="daan">
          <div v-for="(answer, index) in answers" :key="index" class="answer-item">
            {{ answer.value }}
          </div>
        </div>
      </el-main>
      <el-footer>
        <div class="but-daan">
          <el-button @click="showSelectedQuestion()" type="primary" round>答案</el-button>
        </div>
        <div class="fixed-button-container">
          <el-button @click="toggleRandomizer" type="primary" round>{{ buttonText }}</el-button>
        </div>
        <el-button class="btn-left" type="primary" style="margin-left: 16px" @click="drawer = true">
          上传
        </el-button>
        <!-- <div class="btn-left">
          <el-button @click="updata" type="primary" round>上传</el-button>
        </div> -->
      </el-footer>
    </el-container>
  </div>
  <!-- 抽题 -->
  <el-drawer v-model="drawer" direction="btt" size="90%" title="上传题目" :with-header="false">
    <span>上传题目</span>
    <el-divider />
    <el-form ref="formRef" :model="dynamicValidateForm" label-width="120px" class="demo-dynamic">
      <el-form-item prop="question" label="题目" :rules="[
        // {
        //   required: true,
        //   message: 'Please input ques address',
        //   trigger: 'blur',
        // },
        {
          type: 'string',
          message: 'Please input correct ques address',
          trigger: ['blur', 'change'],
        },
      ]">
        <el-input v-model="dynamicValidateForm.question" />
      </el-form-item>
      <el-form-item v-for="(answers, index) in dynamicValidateForm.answers" :key="answers.key" :label="'答案' + (index + 1)"
        :prop="'answers' + index + '.value'">
        <el-input v-model="answers.value" />
        <el-button class="mt-2" @click.prevent="removeanswers(answers)">Delete</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm(formRef)">Submit</el-button>
        <el-button @click="addanswers">New answer</el-button>
        <el-button @click="resetForm(formRef)">Reset</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>
  
<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import type { FormInstance } from 'element-plus'


import axios from 'axios';
let questions = [];
const fetchData = async () => {
  try {
    const response = await axios.post('http://101.43.142.222:13000/gitdata');
    questions = response.data
    showRandomQuestion();
  } catch (error) {
    console.error(error);
  }
};

// Call the fetchData function when the component is mounted or whenever you want to make the request
fetchData(); // 调用 fetchData 函数来获取数据


const drawer = ref(false)
const formRef = ref<FormInstance>()
const dynamicValidateForm = reactive<{
  answers: string[];
  question: string;
}>({
  answers: [],
  question: '',
})

interface answersItem {
  key: number
  value: string[]
}

const removeanswers = (item: answersItem) => {
  const index = dynamicValidateForm.answers.indexOf(item)
  if (index !== -1) {
    dynamicValidateForm.answers.splice(index, 1)
  }
}


const addanswers = () => {
  dynamicValidateForm.answers.push({ value: '' })
}

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  try {
    await formEl.validate();
    const requestData = {
      question: dynamicValidateForm.question,
      answers: dynamicValidateForm.answers,
    };
    const response = await axios.post('http://101.43.142.222:13000/updata', requestData);
    alert("上传成功")
    formEl.resetFields();
    dynamicValidateForm.answers = [];
  } catch (error) {
    console.error('Form validation failed!', error);
  }
};


const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  dynamicValidateForm.answers = [];
};

const count = ref(0);
const buttonText = ref("抽题");
const showAnswerValue = ref(false);
const question = ref("");
const answers = ref<string[]>([]);

function toggleRandomizer() {
  showAnswerValue.value = false;
  if (count.value === 0) {
    buttonText.value = "停止";
    count.value = setInterval(showRandomQuestion, 100);
  } else {
    buttonText.value = "抽题";
    clearInterval(count.value);
    count.value = 0;
  }
}

function showRandomQuestion() {
  if (questions.length > 0) {
    const randomIndex = Math.floor(Math.random() * questions.length);
    question.value = questions[randomIndex].question;
    answers.value = questions[randomIndex].answers;
    showAnswerValue.value = false;
  } else {
    console.error('No questions available.'); // 处理没有问题的情况
  }
}

function showSelectedQuestion() {
  if (showAnswerValue.value == false) {
    showAnswerValue.value = true

  } else {
    showAnswerValue.value = false;
  }
}

onMounted(() => {
  showRandomQuestion();
});
</script>

<style scoped>
.head {
  width: 100%;
  border-radius: 10px;
  text-align: center;
  font-size: 24px;
  color: white;
  background-color: #79BBFF;
  cursor: pointer;
  position: sticky;
  top: 0;
  /* 吸顶时距离顶部的偏移值 */
}

.que {
  padding: 10px 15px;
}

.daan {
  margin-top: 5px;
}

.answer-item {
  margin-bottom: 10px;
  padding: 10px;
  /* background-color: #f8f8f8; */
  border-radius: 10px;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
}

/* 以下不改了 */
.fixed-button-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
}

.but-daan {
  position: fixed;
  bottom: 100px;
  right: 20px;
}

.btn-left {
  position: fixed;
  bottom: 20px;
  left: 20px;
}
/* 在移动设备上禁止双击放大 */
.el-button {
  touch-action: manipulation;
  -ms-content-zooming: none;
  -ms-user-select: none;
  -moz-user-select: none;
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
}
</style>
