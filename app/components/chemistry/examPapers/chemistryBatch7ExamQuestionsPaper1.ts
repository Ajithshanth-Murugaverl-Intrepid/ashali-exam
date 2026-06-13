import { type ExamQuestion } from "../../ExamModule";

// NOTE: `answer` is a 0-based option index.
export const chemistryBatch7ExamQuestionsPaper1: ExamQuestion[] = [
  {
    id: "c7-paper1-q1",
    q: "அலகு 07 (சக்திப்பயினியல்) இல் Hess விதி எதைப் பொருள்படுத்துகிறது?",
    options: [
      "எந்தத் தாக்கத்திலும் வெப்ப மாற்றம் பூச்சியம்",
      "ஒரு தாக்கத்தின் enthalpy மாற்றம் பாதைக்கு சார்ந்தது",
      "ஒரு தாக்கத்தின் மொத்த enthalpy மாற்றம் தொடக்க, இறுதி நிலைகளில் மட்டும் சார்ந்தது",
      "வெப்பம் எப்போதும் வெளியேறும்"
    ],
    answer: 2,
    note: "Hess விதிப்படி, enthalpy ஒரு state function; எனவே path-independent."
  }
];
