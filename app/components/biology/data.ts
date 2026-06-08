import { biologyBatch1ExamQuestionsPaper1 } from "../biologyBatch1ExamQuestionsPaper1";
import { biologyBatch2ExamQuestionsPaper1 } from "../biologyBatch2ExamQuestionsPaper1";
import { biologyBatch3ExamQuestionsPaper1 } from "../biologyBatch3ExamQuestionsPaper1";
import { biologyBatch4ExamQuestionsPaper1 } from "../biologyBatch4ExamQuestionsPaper1";
import { biologyBatch5ExamQuestionsPaper1 } from "../biologyBatch5ExamQuestionsPaper1";
import { biologyBatch6ExamQuestionsPaper1 } from "../biologyBatch6ExamQuestionsPaper1";
import { biologyBatch7ExamQuestionsPaper1 } from "../biologyBatch7ExamQuestionsPaper1";
import { biologyBatch7ExamQuestionsPaper2 } from "../biologyBatch7ExamQuestionsPaper2";
import { type Batch } from "../mcq/types";

export const BIOLOGY_BATCHES: Batch[] = [
  {
    id: "b1",
    label: "தொகுதி 1",
    units: "அலகு 1 & 2",
    focus: "வாழ்வின் இரசாயனவியல் அடிப்படை & செல் உயிரியல்",
    exams: [
      {
        examCode: "BIO-B1-E1",
        label: "பரீட்சை 1",
        target: 50,
        durationSeconds: 7200,
        examQuestions: biologyBatch1ExamQuestionsPaper1
      }
    ]
  },
  {
    id: "b2",
    label: "தொகுதி 2",
    units: "அலகு 3",
    focus: "உயிரினங்களின் பரிணாமம் & பன்முகத்தன்மை",
    exams: [
      {
        examCode: "BIO-B2-E1",
        label: "பரீட்சை 1",
        target: 50,
        durationSeconds: 7200,
        examQuestions: biologyBatch2ExamQuestionsPaper1
      }
    ]
  },
  {
    id: "b3",
    label: "தொகுதி 3",
    units: "அலகு 4",
    focus: "தாவர வடிவமும் செயல்பாடும் (நீர் சமன்பாடு, ஒளிச்சேர்க்கை)",
    exams: [
      {
        examCode: "BIO-B3-E1",
        label: "பரீட்சை 1",
        target: 50,
        durationSeconds: 7200,
        examQuestions: biologyBatch3ExamQuestionsPaper1
      }
    ]
  },
  {
    id: "b4",
    label: "தொகுதி 4",
    units: "அலகு 5 (பகுதி அ)",
    focus: "விலங்கு வடிவமும் செயல்பாடும் — செரிமானம், இரத்த ஓட்டம், சுவாசம்",
    exams: [
      {
        examCode: "BIO-B4-E1",
        label: "பரீட்சை 1",
        target: 50,
        durationSeconds: 7200,
        examQuestions: biologyBatch4ExamQuestionsPaper1
      }
    ]
  },
  {
    id: "b5",
    label: "தொகுதி 5",
    units: "அலகு 5 (பகுதி ஆ)",
    focus: "விலங்கு வடிவமும் செயல்பாடும் — கழிவு நீக்கம், நரம்பு/நாளமில்லா, இனப்பெருக்கம்",
    exams: [
      {
        examCode: "BIO-B5-E1",
        label: "பரீட்சை 1",
        target: 50,
        durationSeconds: 7200,
        examQuestions: biologyBatch5ExamQuestionsPaper1
      }
    ]
  },
  {
    id: "b6",
    label: "தொகுதி 6",
    units: "அலகு 6 & 7",
    focus: "மரபியல், மூலக்கூறு உயிரியல் & மறுசேர்க்கை DNA தொழில்நுட்பம்",
    exams: [
      {
        examCode: "BIO-B6-E1",
        label: "பரீட்சை 1",
        target: 50,
        durationSeconds: 7200,
        examQuestions: biologyBatch6ExamQuestionsPaper1
      }
    ]
  },
  {
    id: "b7",
    label: "தொகுதி 7",
    units: "அலகு 8, 9 & 10",
    focus: "சுற்றுச்சூழல் உயிரியல், நுண்ணுயிரியல் & பயன்பாட்டு உயிரியல்",
    exams: [
      {
        examCode: "BIO-B7-E1",
        label: "பரீட்சை 1",
        target: 50,
        durationSeconds: 7200,
        examQuestions: biologyBatch7ExamQuestionsPaper1
      },
      {
        examCode: "BIO-B7-E2",
        label: "பரீட்சை 2",
        target: 50,
        durationSeconds: 7200,
        examQuestions: biologyBatch7ExamQuestionsPaper2
      }
    ]
  }
];
