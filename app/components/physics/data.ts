import { physicsBatch1ExamQuestionsPaper1 } from "../physicsBatch1ExamQuestionsPaper1";
import { physicsBatch2ExamQuestionsPaper1 } from "../physicsBatch2ExamQuestionsPaper1";
import { physicsBatch2ExamQuestionsPaper2 } from "../physicsBatch2ExamQuestionsPaper2";
import { physicsBatch2ExamQuestionsPaper3 } from "../physicsBatch2ExamQuestionsPaper3";
import { physicsBatch2ExamQuestionsPaper4 } from "../physicsBatch2ExamQuestionsPaper4";
import { physicsBatch2ExamQuestionsPaper5 } from "../physicsBatch2ExamQuestionsPaper5";
import { physicsBatch3ExamQuestionsPaper1 } from "../physicsBatch3ExamQuestionsPaper1";
import { physicsBatch3ExamQuestionsPaper2 } from "../physicsBatch3ExamQuestionsPaper2";
import { physicsBatch3ExamQuestionsPaper3 } from "../physicsBatch3ExamQuestionsPaper3";
import { physicsBatch3ExamQuestionsPaper4 } from "../physicsBatch3ExamQuestionsPaper4";
import { physicsBatch4ExamQuestionsPaper1 } from "../physicsBatch4ExamQuestionsPaper1";
import { physicsBatch5ExamQuestionsPaper1 } from "../physicsBatch5ExamQuestionsPaper1";
import { physicsBatch6ExamQuestionsPaper1 } from "../physicsBatch6ExamQuestionsPaper1";
import { physicsBatch7ExamQuestionsPaper1 } from "../physicsBatch7ExamQuestionsPaper1";
import { physicsBatch8ExamQuestionsPaper1 } from "../physicsBatch8ExamQuestionsPaper1";
import { physicsBatch9ExamQuestionsPaper1 } from "../physicsBatch9ExamQuestionsPaper1";
import { physicsBatch10ExamQuestionsPaper1 } from "../physicsBatch10ExamQuestionsPaper1";
import { physicsBatch11ExamQuestionsPaper1 } from "../physicsBatch11ExamQuestionsPaper1";
import { type Batch } from "./types";

export const PHYSICS_BATCHES: Batch[] = [
  {
    id: "p1",
    label: "தொகுதி 1",
    units: "அலகு 1",
    focus: "அளவீடு: SI அலகுகள், பரிமாணங்கள், அளவீட்டு கருவிகள், திசையன்கள்",
    exams: [
      {
        examCode: "PHY-B1-E1",
        label: "பரீட்சை 1",
        target: 50,
        durationSeconds: 7200,
        examQuestions: physicsBatch1ExamQuestionsPaper1
      }
    ]
  },
  {
    id: "p2",
    label: "தொகுதி 2",
    units: "அலகு 2",
    focus: "பொறியியல்: Kinematics, Dynamics, Statics, Work-Energy-Power, வட்ட/சுழற்சி இயக்கம், Hydrostatics",
    exams: [
      {
        examCode: "PHY-B2-E1",
        label: "பரீட்சை 1",
        focus: "இயக்கவியல் (Kinematics) & இயக்க வரைபுகள்",
        target: 50,
        durationSeconds: 7200,
        examQuestions: physicsBatch2ExamQuestionsPaper1
      },
      {
        examCode: "PHY-B2-E2",
        label: "பரீட்சை 2",
        focus: "இயக்கவிசையியல் (Dynamics) & நிலைத்தியல் (Statics)",
        target: 50,
        durationSeconds: 7200,
        examQuestions: physicsBatch2ExamQuestionsPaper2
      },
      {
        examCode: "PHY-B2-E3",
        label: "பரீட்சை 3",
        focus: "வேலை, சக்தி, வலு (Work, Energy, Power)",
        target: 50,
        durationSeconds: 7200,
        examQuestions: physicsBatch2ExamQuestionsPaper3
      },
      {
        examCode: "PHY-B2-E4",
        label: "பரீட்சை 4",
        focus: "வட்ட இயக்கம் மற்றும் சுழற்சி இயக்கவிசையியல்",
        target: 50,
        durationSeconds: 7200,
        examQuestions: physicsBatch2ExamQuestionsPaper4
      },
      {
        examCode: "PHY-B2-E5",
        label: "பரீட்சை 5",
        focus: "நீர்நிலைத்தியல் (Hydrostatics)",
        target: 50,
        durationSeconds: 7200,
        examQuestions: physicsBatch2ExamQuestionsPaper5
      }
    ]
  },
  {
    id: "p3",
    label: "தொகுதி 3",
    units: "அலகு 3",
    focus: "அலைவுகளும் அலைகளும்: SHM, ஒலி, ஒளி, குறுக்கீடு, விளிம்பு விளைவு, முனைவாக்கம்",
    exams: [
      {
        examCode: "PHY-B3-E1",
        label: "பரீட்சை 1",
        focus: "எளிய இசை இயக்கம் (Simple Harmonic Motion - SHM)",
        target: 50,
        durationSeconds: 7200,
        examQuestions: physicsBatch3ExamQuestionsPaper1
      },
      {
        examCode: "PHY-B3-E2",
        label: "பரீட்சை 2",
        focus: "பொது அலை இயக்கம் (General Wave Motion)",
        target: 50,
        durationSeconds: 7200,
        examQuestions: physicsBatch3ExamQuestionsPaper2
      },
      {
        examCode: "PHY-B3-E3",
        label: "பரீட்சை 3",
        focus: "ஒலியலைகள் (Sound Waves)",
        target: 50,
        durationSeconds: 7200,
        examQuestions: physicsBatch3ExamQuestionsPaper3
      },
      {
        examCode: "PHY-B3-E4",
        label: "பரீட்சை 4",
        focus: "ஒளியியல் மற்றும் அலை ஒளியியல் (Light & Wave Optics)",
        target: 50,
        durationSeconds: 7200,
        examQuestions: physicsBatch3ExamQuestionsPaper4
      }
    ]
  },
  {
    id: "p4",
    label: "தொகுதி 4",
    units: "அலகு 4",
    focus: "வெப்பப் பௌதிகவியல்: வெப்பநிலை, வாயு விதிகள், வெப்ப இடமாற்றம், வெப்ப இயக்கவியல்",
    exams: [
      {
        examCode: "PHY-B4-E1",
        label: "பரீட்சை 1",
        target: 50,
        durationSeconds: 7200,
        examQuestions: physicsBatch4ExamQuestionsPaper1
      }
    ]
  },
  {
    id: "p5",
    label: "தொகுதி 5",
    units: "அலகு 5",
    focus: "ஈர்ப்புப் புலம்: அகில ஈர்ப்பு விதி, g, விடுபடுகதி, செயற்கைக்கோள் இயக்கம்",
    exams: [
      {
        examCode: "PHY-B5-E1",
        label: "பரீட்சை 1",
        target: 50,
        durationSeconds: 7200,
        examQuestions: physicsBatch5ExamQuestionsPaper1
      }
    ]
  },
  {
    id: "p6",
    label: "தொகுதி 6",
    units: "அலகு 6",
    focus: "நிலைமின்புலம்: கூலோம் விதி, மின்புலச்செறிவு, அழுத்தம், கொள்ளளவிகள்",
    exams: [
      {
        examCode: "PHY-B6-E1",
        label: "பரீட்சை 1",
        target: 50,
        durationSeconds: 7200,
        examQuestions: physicsBatch6ExamQuestionsPaper1
      }
    ]
  },
  {
    id: "p7",
    label: "தொகுதி 7",
    units: "அலகு 7",
    focus: "காந்தப்புலம்: அசையும் மின்னேற்றங்கள், Biot-Savart, Ampere விதி, சுருள் மீதான திருப்புத்திறன்",
    exams: [
      {
        examCode: "PHY-B7-E1",
        label: "பரீட்சை 1",
        target: 50,
        durationSeconds: 7200,
        examQuestions: physicsBatch7ExamQuestionsPaper1
      }
    ]
  },
  {
    id: "p8",
    label: "தொகுதி 8",
    units: "அலகு 8",
    focus: "ஓட்டமின்னியல்: Ohm விதி, e.m.f., Kirchhoff விதிகள், Wheatstone bridge, Potentiometer",
    exams: [
      {
        examCode: "PHY-B8-E1",
        label: "பரீட்சை 1",
        target: 50,
        durationSeconds: 7200,
        examQuestions: physicsBatch8ExamQuestionsPaper1
      }
    ]
  },
  {
    id: "p9",
    label: "தொகுதி 9",
    units: "அலகு 9",
    focus: "இலத்திரனியல்: Diodes, Transistor, Op-Amp, Digital logic gates",
    exams: [
      {
        examCode: "PHY-B9-E1",
        label: "பரீட்சை 1",
        target: 50,
        durationSeconds: 7200,
        examQuestions: physicsBatch9ExamQuestionsPaper1
      }
    ]
  },
  {
    id: "p10",
    label: "தொகுதி 10",
    units: "அலகு 10",
    focus: "பதார்த்தங்களின் இயந்திரவியல் இயல்புகள்: மீட்சித்தன்மை, பாகுத்தன்மை, மேற்பரப்பு இழுவை",
    exams: [
      {
        examCode: "PHY-B10-E1",
        label: "பரீட்சை 1",
        target: 50,
        durationSeconds: 7200,
        examQuestions: physicsBatch10ExamQuestionsPaper1
      }
    ]
  },
  {
    id: "p11",
    label: "தொகுதி 11",
    units: "அலகு 11",
    focus: "பதார்த்தமும் கதிர்வீச்சும்: ஒளிமின் விளைவு, அணுக்கட்டமைப்பு, உட்கருப் பௌதிகவியல்",
    exams: [
      {
        examCode: "PHY-B11-E1",
        label: "பரீட்சை 1",
        target: 50,
        durationSeconds: 7200,
        examQuestions: physicsBatch11ExamQuestionsPaper1
      }
    ]
  }
];
