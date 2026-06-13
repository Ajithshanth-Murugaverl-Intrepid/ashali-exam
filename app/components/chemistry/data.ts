import { chemistryBatch1ExamQuestionsPaper1 } from "./examPapers/chemistryBatch1ExamQuestionsPaper1";
import { chemistryBatch2ExamQuestionsPaper1 } from "./examPapers/chemistryBatch2ExamQuestionsPaper1";
import { chemistryBatch3ExamQuestionsPaper1 } from "./examPapers/chemistryBatch3ExamQuestionsPaper1";
import { chemistryBatch4ExamQuestionsPaper1 } from "./examPapers/chemistryBatch4ExamQuestionsPaper1";
import { chemistryBatch5ExamQuestionsPaper1 } from "./examPapers/chemistryBatch5ExamQuestionsPaper1";
import { chemistryBatch6ExamQuestionsPaper1 } from "./examPapers/chemistryBatch6ExamQuestionsPaper1";
import { chemistryBatch7ExamQuestionsPaper1 } from "./examPapers/chemistryBatch7ExamQuestionsPaper1";
import { chemistryBatch8ExamQuestionsPaper1 } from "./examPapers/chemistryBatch8ExamQuestionsPaper1";
import { chemistryBatch9ExamQuestionsPaper1 } from "./examPapers/chemistryBatch9ExamQuestionsPaper1";
import { chemistryBatch10ExamQuestionsPaper1 } from "./examPapers/chemistryBatch10ExamQuestionsPaper1";
import { chemistryBatch11ExamQuestionsPaper1 } from "./examPapers/chemistryBatch11ExamQuestionsPaper1";
import { chemistryBatch12ExamQuestionsPaper1 } from "./examPapers/chemistryBatch12ExamQuestionsPaper1";
import { chemistryBatch13ExamQuestionsPaper1 } from "./examPapers/chemistryBatch13ExamQuestionsPaper1";
import { chemistryBatch14ExamQuestionsPaper1 } from "./examPapers/chemistryBatch14ExamQuestionsPaper1";
import { type Batch } from "../mcq/types";

export const CHEMISTRY_BATCHES: Batch[] = [
  {
    id: "c1",
    label: "தொகுதி 1",
    units: "அலகு 01",
    focus: "அணுக்கட்டமைப்பு (Atomic Structure)",
    exams: [
      {
        examCode: "CHEM-B1-E1",
        label: "பரீட்சை 1",
        target: 50,
        durationSeconds: 7200,
        examQuestions: chemistryBatch1ExamQuestionsPaper1
      }
    ]
  },
  {
    id: "c2",
    label: "தொகுதி 2",
    units: "அலகு 02",
    focus: "கட்டமைப்பும் பிணைப்பும் (Structure and Bonding)",
    exams: [
      {
        examCode: "CHEM-B2-E1",
        label: "பரீட்சை 1",
        target: 50,
        durationSeconds: 7200,
        examQuestions: chemistryBatch2ExamQuestionsPaper1
      }
    ]
  },
  {
    id: "c3",
    label: "தொகுதி 3",
    units: "அலகு 03",
    focus: "இரசாயனக் கணிப்புகள் (Chemical Calculations)",
    exams: [
      {
        examCode: "CHEM-B3-E1",
        label: "பரீட்சை 1",
        target: 50,
        durationSeconds: 7200,
        examQuestions: chemistryBatch3ExamQuestionsPaper1
      }
    ]
  },
  {
    id: "c4",
    label: "தொகுதி 4",
    units: "அலகு 04",
    focus: "ஆவர்த்தனத்தன்மை (Periodicity)",
    exams: [
      {
        examCode: "CHEM-B4-E1",
        label: "பரீட்சை 1",
        target: 50,
        durationSeconds: 7200,
        examQuestions: chemistryBatch4ExamQuestionsPaper1
      }
    ]
  },
  {
    id: "c5",
    label: "தொகுதி 5",
    units: "அலகு 05",
    focus: "s, p, d தொகுதி மூலகங்களின் இரசாயனம்",
    exams: [
      {
        examCode: "CHEM-B5-E1",
        label: "பரீட்சை 1",
        target: 50,
        durationSeconds: 7200,
        examQuestions: chemistryBatch5ExamQuestionsPaper1
      }
    ]
  },
  {
    id: "c6",
    label: "தொகுதி 6",
    units: "அலகு 06",
    focus: "வாயு நிலை (Gas Phase)",
    exams: [
      {
        examCode: "CHEM-B6-E1",
        label: "பரீட்சை 1",
        target: 50,
        durationSeconds: 7200,
        examQuestions: chemistryBatch6ExamQuestionsPaper1
      }
    ]
  },
  {
    id: "c7",
    label: "தொகுதி 7",
    units: "அலகு 07",
    focus: "சக்திப்பயினியல் / வெப்ப இரசாயனவியல்",
    exams: [
      {
        examCode: "CHEM-B7-E1",
        label: "பரீட்சை 1",
        target: 50,
        durationSeconds: 7200,
        examQuestions: chemistryBatch7ExamQuestionsPaper1
      }
    ]
  },
  {
    id: "c8",
    label: "தொகுதி 8",
    units: "அலகு 08",
    focus: "இரசாயனச் சமநிலை (Chemical Equilibrium)",
    exams: [
      {
        examCode: "CHEM-B8-E1",
        label: "பரீட்சை 1",
        target: 50,
        durationSeconds: 7200,
        examQuestions: chemistryBatch8ExamQuestionsPaper1
      }
    ]
  },
  {
    id: "c9",
    label: "தொகுதி 9",
    units: "அலகு 09",
    focus: "அயன் சமநிலை (Ionic Equilibrium)",
    exams: [
      {
        examCode: "CHEM-B9-E1",
        label: "பரீட்சை 1",
        target: 50,
        durationSeconds: 7200,
        examQuestions: chemistryBatch9ExamQuestionsPaper1
      }
    ]
  },
  {
    id: "c10",
    label: "தொகுதி 10",
    units: "அலகு 10",
    focus: "இரசாயன இயக்கவியல் (Chemical Kinetics)",
    exams: [
      {
        examCode: "CHEM-B10-E1",
        label: "பரீட்சை 1",
        target: 50,
        durationSeconds: 7200,
        examQuestions: chemistryBatch10ExamQuestionsPaper1
      }
    ]
  },
  {
    id: "c11",
    label: "தொகுதி 11",
    units: "அலகு 11",
    focus: "அடிப்படைச் சேதன இரசாயனவியல்",
    exams: [
      {
        examCode: "CHEM-B11-E1",
        label: "பரீட்சை 1",
        target: 50,
        durationSeconds: 7200,
        examQuestions: chemistryBatch11ExamQuestionsPaper1
      }
    ]
  },
  {
    id: "c12",
    label: "தொகுதி 12",
    units: "அலகு 12",
    focus: "Hydrocarbons & Alkyl Halides",
    exams: [
      {
        examCode: "CHEM-B12-E1",
        label: "பரீட்சை 1",
        target: 50,
        durationSeconds: 7200,
        examQuestions: chemistryBatch12ExamQuestionsPaper1
      }
    ]
  },
  {
    id: "c13",
    label: "தொகுதி 13",
    units: "அலகு 13",
    focus: "Oxygen & Nitrogen கொண்ட சேதனச் சேர்வுகள்",
    exams: [
      {
        examCode: "CHEM-B13-E1",
        label: "பரீட்சை 1",
        target: 50,
        durationSeconds: 7200,
        examQuestions: chemistryBatch13ExamQuestionsPaper1
      }
    ]
  },
  {
    id: "c14",
    label: "தொகுதி 14",
    units: "அலகு 14",
    focus: "கைத்தொழில் மற்றும் சூழல் இரசாயனவியல்",
    exams: [
      {
        examCode: "CHEM-B14-E1",
        label: "பரீட்சை 1",
        target: 50,
        durationSeconds: 7200,
        examQuestions: chemistryBatch14ExamQuestionsPaper1
      }
    ]
  }
];
