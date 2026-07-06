import type { Language } from "./types";

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
  };
  nav: {
    dashboard: string;
    tasks: string;
    calendar: string;
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
    greeting: string;
    subtitle: string;
    dayBadge: string;
    statXp: string;
    statStreak: string;
    statMinutes: string;
    statProgress: string;
    todayTasks: string;
    viewAll: string;
    quote: string;
    latestAchievement: string;
    noAchievementYet: string;
  };
  tasks: {
    title: string;
    subtitle: string;
    progressLabel: string;
    allDone: string;
    keepGoing: string;
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
  calendar: {
    title: string;
    subtitle: string;
    legendFull: string;
    legendPartial: string;
    legendNone: string;
    noActivity: string;
    tasksCompleted: string;
    minutesLogged: string;
    xpEarned: string;
    selectDay: string;
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
    },
    nav: {
      dashboard: "Dashboard",
      tasks: "Tasks",
      calendar: "Calendar",
      team: "Team",
      achievements: "Awards",
      profile: "Profile",
    },
    app: {
      name: "English Journey",
      tagline: "Your daily path to fluency",
    },
    onboarding: {
      title: "Who's learning today?",
      subtitle: "Pick your profile to continue your journey",
      start: "Continue",
    },
    dashboard: {
      greeting: "Welcome back, {{name}}",
      subtitle: "Let's make today count.",
      dayBadge: "Day {{day}}",
      statXp: "Total XP",
      statStreak: "Day Streak",
      statMinutes: "Minutes Learned",
      statProgress: "Today's Progress",
      todayTasks: "Today's Tasks",
      viewAll: "View all",
      quote: "Small steps every day lead to fluency.",
      latestAchievement: "Latest Achievement",
      noAchievementYet: "Complete tasks to earn your first badge",
    },
    tasks: {
      title: "Daily Tasks",
      subtitle: "Complete your tasks to build your streak",
      progressLabel: "{{done}} of {{total}} required tasks done",
      allDone: "All done for today. Amazing work!",
      keepGoing: "Keep going, you're doing great!",
      optionalBadge: "Optional",
      task: {
        listening: {
          title: "Listening",
          description: "Listen to native English audio or podcasts",
        },
        vocabulary: {
          title: "Vocabulary",
          description: "Learn new words and phrases",
        },
        vocabularyReview: {
          title: "Vocabulary Review",
          description: "Review previously learned vocabulary",
        },
        grammar: {
          title: "Grammar",
          description: "Study a new grammar concept",
        },
        grammarReview: {
          title: "Grammar Review",
          description: "Revisit earlier grammar lessons",
        },
        reading: {
          title: "Reading",
          description: "Read an English article or story",
        },
        speaking: {
          title: "Speaking",
          description: "Practice speaking out loud",
        },
        aiFeedback: {
          title: "AI Feedback",
          description: "Get feedback on your speaking or writing",
        },
        shadowing: {
          title: "Shadowing",
          description: "Repeat along with native speaker audio",
        },
      },
    },
    calendar: {
      title: "Calendar",
      subtitle: "Track your daily learning activity",
      legendFull: "Fully completed",
      legendPartial: "Partially completed",
      legendNone: "No activity",
      noActivity: "No activity recorded",
      tasksCompleted: "Tasks completed",
      minutesLogged: "Minutes logged",
      xpEarned: "XP earned",
      selectDay: "Select a day to see details",
    },
    team: {
      title: "Team Progress",
      subtitle: "See how everyone is progressing together",
      you: "You",
      progressToday: "Today",
    },
    achievements: {
      title: "Achievements",
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
    },
    nav: {
      dashboard: "الرئيسية",
      tasks: "المهام",
      calendar: "التقويم",
      team: "الفريق",
      achievements: "الإنجازات",
      profile: "الملف الشخصي",
    },
    app: {
      name: "English Journey",
      tagline: "طريقك اليومي نحو الطلاقة",
    },
    onboarding: {
      title: "من المتعلم اليوم؟",
      subtitle: "اختر ملفك الشخصي لمتابعة رحلتك",
      start: "متابعة",
    },
    dashboard: {
      greeting: "أهلاً بعودتك، {{name}}",
      subtitle: "لنجعل اليوم مميزًا.",
      dayBadge: "اليوم {{day}}",
      statXp: "إجمالي نقاط الخبرة",
      statStreak: "أيام التتابع",
      statMinutes: "دقائق التعلم",
      statProgress: "تقدم اليوم",
      todayTasks: "مهام اليوم",
      viewAll: "عرض الكل",
      quote: "خطوات صغيرة كل يوم تقودك نحو الطلاقة.",
      latestAchievement: "آخر إنجاز",
      noAchievementYet: "أكمل المهام للحصول على أول وسام",
    },
    tasks: {
      title: "المهام اليومية",
      subtitle: "أكمل مهامك لبناء تتابعك",
      progressLabel: "{{done}} من {{total}} مهام مطلوبة مكتملة",
      allDone: "أحسنت! أكملت كل شيء اليوم.",
      keepGoing: "استمر، أنت تقوم بعمل رائع!",
      optionalBadge: "اختياري",
      task: {
        listening: {
          title: "الاستماع",
          description: "استمع إلى صوتيات أو بودكاست باللغة الإنجليزية",
        },
        vocabulary: {
          title: "المفردات",
          description: "تعلّم كلمات وعبارات جديدة",
        },
        vocabularyReview: {
          title: "مراجعة المفردات",
          description: "راجع المفردات التي تعلمتها سابقًا",
        },
        grammar: {
          title: "القواعد",
          description: "ادرس قاعدة نحوية جديدة",
        },
        grammarReview: {
          title: "مراجعة القواعد",
          description: "راجع دروس القواعد السابقة",
        },
        reading: {
          title: "القراءة",
          description: "اقرأ مقالًا أو قصة باللغة الإنجليزية",
        },
        speaking: {
          title: "المحادثة",
          description: "تدرب على التحدث بصوت عالٍ",
        },
        aiFeedback: {
          title: "تقييم الذكاء الاصطناعي",
          description: "احصل على تقييم لمحادثتك أو كتابتك",
        },
        shadowing: {
          title: "المحاكاة الصوتية",
          description: "كرر مع صوت متحدث أصلي",
        },
      },
    },
    calendar: {
      title: "التقويم",
      subtitle: "تابع نشاطك التعليمي اليومي",
      legendFull: "مكتمل بالكامل",
      legendPartial: "مكتمل جزئيًا",
      legendNone: "لا يوجد نشاط",
      noActivity: "لا يوجد نشاط مسجل",
      tasksCompleted: "المهام المكتملة",
      minutesLogged: "الدقائق المسجلة",
      xpEarned: "نقاط الخبرة المكتسبة",
      selectDay: "اختر يومًا لعرض التفاصيل",
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
