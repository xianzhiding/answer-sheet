<template>
<div>
  <!-- 学生标题 -->
  <column-dialog ref="studentDialog" />
  <!-- 准考证号 -->
  <admission-number-dialog ref="admissionDialog" />
  <!-- 选择题 -->
  <question-dialog ref="questionDialogs" />
  <!-- 填空题 -->
  <fill-in-the-blank-dialog ref="fillInTheBlanks" />
  <!-- 解答题 -->
  <answer-question-dialog ref="AnswerQuestionDialog"/>
  <!-- 选作题 -->
  <optional-question-dialog ref="optionalQuestionDialog"/>
  <!-- 作文英 -->
  <composition-english-dialog ref="compositionEnglish"/>
  <!-- 作文语文 -->
  <composition-language-dialog ref="compositionLanguage"/>
  <!-- 非作答区 -->
  <non-rresponse-area ref="NonRresponseArea"/>
</div>
</template>

<script>
import columnDialog from './_studentColumnDialog'
import AdmissionNumberDialog from './_AdmissionNumberDialog'

import questionDialog from './_objectiveQuestion'

import FillInTheBlankDialog from './_FillInTheBlankDialog'
import AnswerQuestionDialog from './_AnswerQuestionDialog'
import optionalQuestionDialog from './_optionalQuestionDialog'
import compositionEnglishDialog from './_compositionEnglishDialog'
import compositionLanguageDialog from './_compositionLanguageDialog'
import NonRresponseArea from './_NonRresponseArea'
export default {
  components: {
    columnDialog,
    AdmissionNumberDialog,
    questionDialog,
    FillInTheBlankDialog,
    AnswerQuestionDialog,
    optionalQuestionDialog,
    compositionEnglishDialog,
    compositionLanguageDialog,
    NonRresponseArea,
  },
  computed: {
    isComponent () {
      return AnswerQuestionDialog
    }
  },
  methods: {
    opened (type, Arr) {
      switch (type) {
        case 'studentTitle':
          this.$refs.studentDialog.openedFrameFunc(Arr)
          break
        case 'AdmissionNumber':
          this.$refs.admissionDialog.openedFrameFunc()
          break
        case 'questionDialogs':
          this.$refs.questionDialogs.opened()
          break
        case 'fillInTheBlanks':
          this.$refs.fillInTheBlanks.opened()
          break
        case 'answerQuestion':
          this.$refs.AnswerQuestionDialog.opened()
          break
        case 'optionalQuestion':
          this.$refs.optionalQuestionDialog.opened()
          break
        case 'compositionEnglish':
          this.$refs.compositionEnglish.opened()
          break
        case 'compositionLanguage':
          this.$refs.compositionLanguage.opened()
          break
        case 'NonRresponseArea':
          this.$refs.NonRresponseArea.opened()
          break
        default:
          break
      }
    },
    openedEdit (type, obj, id) {
      switch (type) {
        case 'studentTitle':
          this.$refs.studentDialog.openedFrameFunc()
          break
        case 'questionDialogs':
          this.$refs.questionDialogs.openedEdit(obj)
          break
        case 'fillInTheBlanks':
          this.$refs.fillInTheBlanks.openedEdit(obj)
          break
        case 'answerQuestion':
          this.$refs.AnswerQuestionDialog.openedEdit(obj)
          break
        case 'optionalQuestion':
          this.$refs.optionalQuestionDialog.openedEdit({ ...obj, id: id })
          break
        case 'compositionEnglish':
          this.$refs.compositionEnglish.openedEdit(obj)
          break
        case 'compositionLanguage':
          this.$refs.compositionLanguage.openedEdit(obj)
          break
        case 'NonRresponseArea':
          this.$refs.NonRresponseArea.openedEdit(obj)
          break
        default:
          break
      }
    },
    change (type, obj, num) {
      switch (type) {
        case 'questionDialogs':
          this.$refs.questionDialogs.change(obj, num)
          break
        case 'NonRresponseArea':
          this.$refs.NonRresponseArea.change(obj, num)
          break
        default:
          break
      }
    },
    changeSpacing(obj){
      this.$refs.compositionLanguage.changeSpacing(obj)
    },
    hanldeCurQuestion () {
      this.$refs.fillInTheBlanks.hanldeCurQuestion()
    },
    // changeColumn(status){
    //   this.$refs.questionDialogs.changeColumn(status)
    // },
  },
}
</script>