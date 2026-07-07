import type { TaskDefinition, TaskId } from "./types";

const LISTENING_URL =
  "https://podcasts.apple.com/sa/podcast/daily-english-listening-%D8%A7%D8%B3%D8%AA%D9%85%D8%A7%D8%B9-%D8%A7%D9%84%D8%A5%D9%86%D8%AC%D9%84%D9%8A%D8%B2%D9%8A%D8%A9-%D9%8A%D9%88%D9%85%D9%8A%D8%A7/id1755537616?l=ar";
const VOCABULARY_BOOKLET_URL =
  "https://cdn.dalilkplatform.com/storage/2025/06/02082415/Booklet-350-Words-final-td.pdf";
const GRAMMAR_BOOKLET_URL =
  "https://cdn.dalilkplatform.com/storage/2025/05/19130725/كتيب-الـ-١٧-قاعدة-محدث-1.pdf";

export const TASKS: TaskDefinition[] = [
  {
    id: "listening",
    minutes: 30,
    xp: 30,
    icon: "Headphones",
    resourceUrl: LISTENING_URL,
  },
  {
    id: "vocabulary",
    minutes: 5,
    xp: 10,
    icon: "BookOpen",
    resourceUrl: VOCABULARY_BOOKLET_URL,
  },
  {
    id: "vocabularyReview",
    minutes: 5,
    xp: 10,
    icon: "RotateCcw",
    resourceUrl: VOCABULARY_BOOKLET_URL,
  },
  {
    id: "grammar",
    minutes: 5,
    xp: 10,
    icon: "SpellCheck",
    resourceUrl: GRAMMAR_BOOKLET_URL,
  },
  {
    id: "grammarReview",
    minutes: 5,
    xp: 10,
    icon: "RefreshCw",
    resourceUrl: GRAMMAR_BOOKLET_URL,
  },
  {
    id: "reading",
    minutes: 10,
    xp: 15,
    icon: "BookMarked",
    resourceUrl: "https://dalilk4english.com/library/reading.html",
  },
  {
    id: "speaking",
    minutes: 5,
    xp: 15,
    icon: "Mic",
    resourceUrl:
      "https://drive.google.com/file/d/12DphnRcY21kuafP086ZjkiusLgQv_PdG/view",
  },
  {
    id: "aiFeedback",
    minutes: 10,
    xp: 15,
    icon: "Sparkles",
    resourceUrl: "https://chatgpt.com/",
  },
  {
    id: "shadowing",
    minutes: 10,
    xp: 10,
    optional: true,
    icon: "AudioLines",
    resourceUrl: LISTENING_URL,
  },
];

export const REQUIRED_TASKS = TASKS.filter((t) => !t.optional);
export const OPTIONAL_TASKS = TASKS.filter((t) => t.optional);

export const TASK_MAP: Record<TaskId, TaskDefinition> = TASKS.reduce(
  (acc, task) => {
    acc[task.id] = task;
    return acc;
  },
  {} as Record<TaskId, TaskDefinition>,
);

export const REQUIRED_TASK_COUNT = REQUIRED_TASKS.length;
export const TOTAL_DAILY_MINUTES = TASKS.reduce((sum, t) => sum + t.minutes, 0);
export const REQUIRED_DAILY_MINUTES = REQUIRED_TASKS.reduce(
  (sum, t) => sum + t.minutes,
  0,
);
