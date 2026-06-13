import { type ExamQuestion } from "../../ExamModule";

// NOTE: `answer` is a 0-based option index.
export const chemistryBatch1ExamQuestionsPaper1: ExamQuestion[] = [
  {
    id: "c1-paper1-q1",
    q: "அலகு 01 (அணுக்கட்டமைப்பு) தொடர்பாக சரியான கூற்று எது?",
    options: [
      "Pauli விதி படி ஒரே orbital இல் 3 இலத்திரன்கள் இருக்கலாம்",
      "Aufbau கொள்கை படி இலத்திரன்கள் உயர்ந்த ஆற்றல் நிலையிலிருந்து நிரப்பப்படும்",
      "ஒரு orbital இல் எதிர் spin உடைய 2 இலத்திரன்கள் மட்டுமே இருக்க முடியும்",
      "Hund விதி ஒரே spin ஐத் தடை செய்கிறது"
    ],
    answer: 2,
    note: "Pauli இன் தவிர்ப்புத் தத்துவப்படி, ஒரு orbital இல் அதிகபட்சம் 2 இலத்திரன்கள் மட்டுமே (எதிர் spin) இருக்க முடியும்."
  }
];
