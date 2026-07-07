import type { Language, MonthKey } from "./types";

export interface Dictionary {
  common: {
    day: string;
    streak: string;
    minutes: string;
    xp: string;
    progress: string;
    today: string;
    optional: string;
    required: string;
    save: string;
    cancel: string;
    reset: string;
    done: string;
    locked: string;
    unlocked: string;
    min: string;
    of: string;
    month: string;
    openResource: string;
    markDone: string;
    undo: string;
    journeyProgress: string;
    open: string;
    notSyncedTitle: string;
    notSyncedBody: string;
  };
  months: Record<MonthKey, { title: string; tagline: string }>;
  nav: {
    home: string;
    journey: string;
    team: string;
    achievements: string;
    profile: string;
  };
  app: {
    name: string;
    tagline: string;
  };
  onboarding: {
    title: string;
    subtitle: string;
    start: string;
  };
  dashboard: {
    greetingMorning: string;
    greetingAfternoon: string;
    greetingEvening: string;
    journeyLine: string;
    todaysProgress: string;
    tasksCompletedLabel: string;
    statXp: string;
    statStreak: string;
    statMinutes: string;
    quote: string;
    latestAchievement: string;
    noAchievementYet: string;
  };
  tasks: {
    optionalBadge: string;
    task: Record<
      | "listening"
      | "vocabulary"
      | "vocabularyReview"
      | "grammar"
      | "grammarReview"
      | "reading"
      | "speaking"
      | "aiFeedback"
      | "shadowing",
      { title: string; description: string }
    >;
  };
  journey: {
    eyebrow: string;
    title: string;
    description: string;
    progress: string;
    allMonths: string;
    backToMonth: string;
    monthEyebrow: string;
    dayHeading: string;
    taskCountLabel: string;
    anyOrder: string;
  };
  journal: {
    wordsToday: string;
    wordsPlaceholder: string;
    exampleSentence: string;
    examplePlaceholder: string;
    yesterdaysWords: string;
    noYesterdayWords: string;
    todaysNotes: string;
    notesPlaceholder: string;
  };
  teamWall: {
    title: string;
    subtitle: string;
    placeholder: string;
    post: string;
    empty: string;
    tabProgress: string;
    tabWall: string;
    teamMessageCard: string;
    noMessagesYet: string;
  };
  team: {
    title: string;
    subtitle: string;
    you: string;
    progressToday: string;
  };
  achievements: {
    title: string;
    subtitle: string;
    unlockedOn: string;
    stillLocked: string;
    item: Record<
      | "firstStep"
      | "perfectDay"
      | "streak3"
      | "streak7"
      | "streak30"
      | "xp500"
      | "xp1000"
      | "xp5000"
      | "marathoner"
      | "bookworm"
      | "chatterbox"
      | "dedicated",
      { title: string; description: string }
    >;
  };
  profile: {
    title: string;
    memberSince: string;
    displayName: string;
    language: string;
    english: string;
    arabic: string;
    theme: string;
    light: string;
    dark: string;
    switchUser: string;
    dangerZone: string;
    resetProgress: string;
    resetDescription: string;
    resetConfirmTitle: string;
    resetConfirmBody: string;
    confirmReset: string;
    yourStats: string;
  };
}

export const dictionaries: Record<Language, Dictionary> = {
  en: {
    common: {
      day: "Day",
      streak: "Streak",
      minutes: "Minutes",
      xp: "XP",
      progress: "Progress",
      today: "Today",
      optional: "Optional",
      required: "Required",
      save: "Save",
      cancel: "Cancel",
      reset: "Reset",
      done: "Done",
      locked: "Locked",
      unlocked: "Unlocked",
      min: "min",
      of: "of",
      month: "Month",
      openResource: "Open resource",
      markDone: "Mark done",
      undo: "Undo",
      journeyProgress: "Journey Progress",
      open: "Open",
      notSyncedTitle: "Not syncing across devices",
      notSyncedBody:
        "Supabase isn't connected in this deployment — this is only saved on this device. Check the environment variables in Vercel and redeploy.",
    },
    months: {
      foundation: {
        title: "Foundation",
        tagline: "Build a solid base",
      },
      confidence: {
        title: "Confidence",
        tagline: "Speak with certainty",
      },
      fluency: {
        title: "Fluency",
        tagline: "Think in English",
      },
    },
    nav: {
      home: "Home",
      journey: "Journey",
      team: "Team",
      achievements: "Awards",
      profile: "Profile",
    },
    app: {
      name: "English Journey",
      tagline: "A quiet study circle",
    },
    onboarding: {
      title: "Who's learning today?",
      subtitle: "Pick your profile to continue your journey",
      start: "Continue",
    },
    dashboard: {
      greetingMorning: "Good morning,",
      greetingAfternoon: "Good afternoon,",
      greetingEvening: "Good evening,",
      journeyLine: "Day {{dayInMonth}} of 30 · Month {{month}} · {{title}}",
      todaysProgress: "Today's Progress",
      tasksCompletedLabel: "tasks completed",
      statXp: "XP",
      statStreak: "Streak",
      statMinutes: "Study Time",
      quote: "Small steps every day lead to fluency.",
      latestAchievement: "Latest Achievement",
      noAchievementYet: "Complete tasks to earn your first badge",
    },
    tasks: {
      optionalBadge: "Optional",
      task: {
        listening: {
          title: "Listening",
          description:
            "Immerse yourself in native English through curated listening practice.",
        },
        vocabulary: {
          title: "Vocabulary",
          description: "Learn today's set from the English Journey vocabulary booklet.",
        },
        vocabularyReview: {
          title: "Vocabulary Review",
          description: "Review previously learned words from the vocabulary booklet.",
        },
        grammar: {
          title: "Grammar",
          description: "Study one rule from the English Journey grammar booklet.",
        },
        grammarReview: {
          title: "Grammar Review",
          description: "Revisit an earlier rule from the grammar booklet.",
        },
        reading: {
          title: "Reading",
          description: "Read a short passage from the reading library.",
        },
        speaking: {
          title: "Speaking",
          description: "Practice speaking out loud with today's guide.",
        },
        aiFeedback: {
          title: "AI Feedback",
          description:
            "Open ChatGPT for a 5-minute voice conversation based on today's lesson.",
        },
        shadowing: {
          title: "Shadowing",
          description: "Repeat after native speakers from today's listening lesson.",
        },
      },
    },
    journey: {
      eyebrow: "3 Months",
      title: "The Journey",
      description:
        "Three 30-day challenges. Complete tasks in any order. Nothing is locked — the pace is yours.",
      progress: "Progress",
      allMonths: "All months",
      backToMonth: "Back to {{title}}",
      monthEyebrow: "Month {{month}} · {{title}}",
      dayHeading: "Day {{day}}",
      taskCountLabel: "{{done}} of {{total}} tasks",
      anyOrder: "complete them in any order.",
    },
    journal: {
      wordsToday: "Words I learned today",
      wordsPlaceholder: "Type the new words you learned...",
      exampleSentence: "Example sentence",
      examplePlaceholder: "Write one sentence using a new word...",
      yesterdaysWords: "Yesterday's Words",
      noYesterdayWords: "No words saved yet.",
      todaysNotes: "Today's Notes",
      notesPlaceholder: "Write anything about today's lesson...",
    },
    teamWall: {
      title: "Team Wall",
      subtitle: "Share encouragement, reminders, and study updates",
      placeholder: "Share something with the team...",
      post: "Post",
      empty: "No messages yet. Be the first to say something!",
      tabProgress: "Progress",
      tabWall: "Wall",
      teamMessageCard: "Team Message",
      noMessagesYet: "No messages yet",
    },
    team: {
      title: "Team Progress",
      subtitle: "See how everyone is progressing together",
      you: "You",
      progressToday: "Today",
    },
    achievements: {
      title: "Awards",
      subtitle: "Badges you've earned on your journey",
      unlockedOn: "Unlocked {{date}}",
      stillLocked: "Keep learning to unlock",
      item: {
        firstStep: {
          title: "First Step",
          description: "Complete your first task",
        },
        perfectDay: {
          title: "Perfect Day",
          description: "Complete all required tasks in one day",
        },
        streak3: {
          title: "Warming Up",
          description: "Reach a 3-day streak",
        },
        streak7: {
          title: "One Week Strong",
          description: "Reach a 7-day streak",
        },
        streak30: {
          title: "Unstoppable",
          description: "Reach a 30-day streak",
        },
        xp500: {
          title: "Rising Star",
          description: "Earn 500 total XP",
        },
        xp1000: {
          title: "Achiever",
          description: "Earn 1,000 total XP",
        },
        xp5000: {
          title: "Legend",
          description: "Earn 5,000 total XP",
        },
        marathoner: {
          title: "Marathoner",
          description: "Log 500 total minutes",
        },
        bookworm: {
          title: "Bookworm",
          description: "Complete Reading 20 times",
        },
        chatterbox: {
          title: "Chatterbox",
          description: "Complete Speaking 20 times",
        },
        dedicated: {
          title: "Dedicated Learner",
          description: "Reach Day 30 of your journey",
        },
      },
    },
    profile: {
      title: "Profile",
      memberSince: "Member since {{date}}",
      displayName: "Display Name",
      language: "Language",
      english: "English",
      arabic: "Arabic",
      theme: "Appearance",
      light: "Light",
      dark: "Dark",
      switchUser: "Switch User",
      dangerZone: "Danger Zone",
      resetProgress: "Reset My Progress",
      resetDescription: "This will erase your XP, streak, and history.",
      resetConfirmTitle: "Reset all progress?",
      resetConfirmBody:
        "This cannot be undone. Your XP, streak, minutes, and history will return to zero.",
      confirmReset: "Yes, reset everything",
      yourStats: "Your Stats",
    },
  },
  ar: {
    common: {
      day: "اليوم",
      streak: "التتابع",
      minutes: "الدقائق",
      xp: "نقاط الخبرة",
      progress: "التقدم",
      today: "اليوم",
      optional: "اختياري",
      required: "مطلوب",
      save: "حفظ",
      cancel: "إلغاء",
      reset: "إعادة تعيين",
      done: "تم",
      locked: "مقفل",
      unlocked: "مفتوح",
      min: "د",
      of: "من",
      month: "الشهر",
      openResource: "فتح المصدر",
      markDone: "تحديد كمكتمل",
      undo: "تراجع",
      journeyProgress: "تقدم الرحلة",
      open: "فتح",
      notSyncedTitle: "لا تتم المزامنة بين الأجهزة",
      notSyncedBody:
        "لم يتم توصيل Supabase في هذا الإصدار — يُحفظ هذا على هذا الجهاز فقط. تحقق من متغيرات البيئة في Vercel وأعد النشر.",
    },
    months: {
      foundation: {
        title: "الأساس",
        tagline: "ابنِ أساسًا متينًا",
      },
      confidence: {
        title: "الثقة",
        tagline: "تحدث بثقة",
      },
      fluency: {
        title: "الطلاقة",
        tagline: "فكّر بالإنجليزية",
      },
    },
    nav: {
      home: "الرئيسية",
      journey: "الرحلة",
      team: "الفريق",
      achievements: "الإنجازات",
      profile: "الملف الشخصي",
    },
    app: {
      name: "English Journey",
      tagline: "دائرة تعلّم هادئة",
    },
    onboarding: {
      title: "من المتعلم اليوم؟",
      subtitle: "اختر ملفك الشخصي لمتابعة رحلتك",
      start: "متابعة",
    },
    dashboard: {
      greetingMorning: "صباح الخير،",
      greetingAfternoon: "مساء الخير،",
      greetingEvening: "مساء الخير،",
      journeyLine: "اليوم {{dayInMonth}} من 30 · الشهر {{month}} · {{title}}",
      todaysProgress: "تقدم اليوم",
      tasksCompletedLabel: "مهام مكتملة",
      statXp: "نقاط الخبرة",
      statStreak: "التتابع",
      statMinutes: "وقت الدراسة",
      quote: "خطوات صغيرة كل يوم تقودك نحو الطلاقة.",
      latestAchievement: "آخر إنجاز",
      noAchievementYet: "أكمل المهام للحصول على أول وسام",
    },
    tasks: {
      optionalBadge: "اختياري",
      task: {
        listening: {
          title: "الاستماع",
          description: "انغمس في اللغة الإنجليزية الأصلية عبر تمارين استماع مختارة.",
        },
        vocabulary: {
          title: "المفردات",
          description: "تعلّم مجموعة اليوم من كتيب مفردات English Journey.",
        },
        vocabularyReview: {
          title: "مراجعة المفردات",
          description: "راجع الكلمات التي تعلمتها سابقًا من كتيب المفردات.",
        },
        grammar: {
          title: "القواعد",
          description: "ادرس قاعدة واحدة من كتيب قواعد English Journey.",
        },
        grammarReview: {
          title: "مراجعة القواعد",
          description: "راجع قاعدة سابقة من كتيب القواعد.",
        },
        reading: {
          title: "القراءة",
          description: "اقرأ نصًا قصيرًا من مكتبة القراءة.",
        },
        speaking: {
          title: "المحادثة",
          description: "تدرب على التحدث بصوت عالٍ باستخدام دليل اليوم.",
        },
        aiFeedback: {
          title: "تقييم الذكاء الاصطناعي",
          description: "افتح ChatGPT لمحادثة صوتية مدتها 5 دقائق حول درس اليوم.",
        },
        shadowing: {
          title: "المحاكاة الصوتية",
          description: "كرر مع المتحدثين الأصليين من درس الاستماع اليوم.",
        },
      },
    },
    journey: {
      eyebrow: "3 أشهر",
      title: "الرحلة",
      description:
        "ثلاثة تحديات مدة كل منها 30 يومًا. أكمل المهام بأي ترتيب. لا شيء مُقفل — الوتيرة لك.",
      progress: "التقدم",
      allMonths: "كل الأشهر",
      backToMonth: "العودة إلى {{title}}",
      monthEyebrow: "الشهر {{month}} · {{title}}",
      dayHeading: "اليوم {{day}}",
      taskCountLabel: "{{done}} من {{total}} مهام",
      anyOrder: "أكملها بأي ترتيب.",
    },
    journal: {
      wordsToday: "الكلمات التي تعلمتها اليوم",
      wordsPlaceholder: "اكتب الكلمات الجديدة التي تعلمتها...",
      exampleSentence: "جملة مثال",
      examplePlaceholder: "اكتب جملة واحدة باستخدام كلمة جديدة...",
      yesterdaysWords: "كلمات الأمس",
      noYesterdayWords: "لا توجد كلمات محفوظة بعد.",
      todaysNotes: "ملاحظات اليوم",
      notesPlaceholder: "اكتب أي شيء عن درس اليوم...",
    },
    teamWall: {
      title: "حائط الفريق",
      subtitle: "شارك التشجيع والتذكيرات وتحديثات الدراسة",
      placeholder: "شارك شيئًا مع الفريق...",
      post: "نشر",
      empty: "لا توجد رسائل بعد. كن أول من يكتب شيئًا!",
      tabProgress: "التقدم",
      tabWall: "الحائط",
      teamMessageCard: "رسالة الفريق",
      noMessagesYet: "لا توجد رسائل بعد",
    },
    team: {
      title: "تقدم الفريق",
      subtitle: "شاهدوا كيف يتقدم الجميع معًا",
      you: "أنت",
      progressToday: "اليوم",
    },
    achievements: {
      title: "الإنجازات",
      subtitle: "الأوسمة التي حصلت عليها في رحلتك",
      unlockedOn: "فُتح في {{date}}",
      stillLocked: "استمر في التعلم لفتحه",
      item: {
        firstStep: {
          title: "الخطوة الأولى",
          description: "أكمل مهمتك الأولى",
        },
        perfectDay: {
          title: "يوم مثالي",
          description: "أكمل جميع المهام المطلوبة في يوم واحد",
        },
        streak3: {
          title: "بداية قوية",
          description: "حقق تتابع 3 أيام",
        },
        streak7: {
          title: "أسبوع كامل",
          description: "حقق تتابع 7 أيام",
        },
        streak30: {
          title: "لا يُوقَف",
          description: "حقق تتابع 30 يومًا",
        },
        xp500: {
          title: "نجم صاعد",
          description: "اكسب 500 نقطة خبرة",
        },
        xp1000: {
          title: "منجز",
          description: "اكسب 1000 نقطة خبرة",
        },
        xp5000: {
          title: "أسطورة",
          description: "اكسب 5000 نقطة خبرة",
        },
        marathoner: {
          title: "عداء المسافات",
          description: "سجّل 500 دقيقة إجمالية",
        },
        bookworm: {
          title: "محب القراءة",
          description: "أكمل مهمة القراءة 20 مرة",
        },
        chatterbox: {
          title: "المتحدث اللبق",
          description: "أكمل مهمة المحادثة 20 مرة",
        },
        dedicated: {
          title: "متعلم ملتزم",
          description: "وصل إلى اليوم 30 من رحلتك",
        },
      },
    },
    profile: {
      title: "الملف الشخصي",
      memberSince: "عضو منذ {{date}}",
      displayName: "الاسم المعروض",
      language: "اللغة",
      english: "الإنجليزية",
      arabic: "العربية",
      theme: "المظهر",
      light: "فاتح",
      dark: "داكن",
      switchUser: "تبديل المستخدم",
      dangerZone: "منطقة الخطر",
      resetProgress: "إعادة تعيين تقدمي",
      resetDescription: "سيؤدي هذا إلى مسح نقاط الخبرة والتتابع والسجل.",
      resetConfirmTitle: "إعادة تعيين كل التقدم؟",
      resetConfirmBody:
        "لا يمكن التراجع عن هذا الإجراء. ستعود نقاط الخبرة والتتابع والدقائق والسجل إلى الصفر.",
      confirmReset: "نعم، أعد تعيين كل شيء",
      yourStats: "إحصائياتك",
    },
  },
};

export function interpolate(template: string, vars?: Record<string, string | number>) {
  if (!vars) return template;
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) =>
    String(vars[key] ?? ""),
  );
}
