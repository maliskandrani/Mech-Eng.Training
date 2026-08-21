import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const ADMIN_EMAIL = "albarasi37@gmail.com";
const ADMIN_PASSWORD = "MR_2026";
const STUDENT_EMAIL = "student@example.com";
const STUDENT_PASSWORD = "Student123!";

/** Pulls a trailing "(English Name)" suffix out of an Arabic title string, if present. */
function extractTitleEn(title: string): string | null {
  const match = title.match(/\(([^()]+)\)\s*$/);
  return match ? match[1].trim() : null;
}

async function main() {
  const adminHash = await bcrypt.hash(ADMIN_PASSWORD, 10);

  const admin = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {},
    create: {
      name: "محمد يوسف رجب",
      nameEn: "Mohamed Y. Rajab",
      designation: "ENGINEER",
      email: ADMIN_EMAIL,
      passwordHash: adminHash,
      role: "ADMIN",
      title: "مهندس ميكانيكي - خبير هندسة الأنابيب والمعدات الثابتة والدوارة",
      titleEn: "Mechanical Engineer — Piping & Static/Rotating Equipment Specialist",
      bio: "مهندس ميكانيكي متخصص في هندسة الأنابيب والمعدات الميكانيكية بقطاع النفط والغاز والبتروكيماويات، له خبرة تمتد لسنوات طويلة في التصميم والتنفيذ والاستشارات الهندسية، ومؤسس أكاديمية تيار المهارات (SkillStream Academy).",
    },
  });

  const [pipingCategory, hvacCategory, softwareCategory] = await Promise.all([
    prisma.category.upsert({
      where: { slug: "piping-mechanical" },
      update: {},
      create: {
        slug: "piping-mechanical",
        name: "هندسة الأنابيب والميكانيكا",
        nameEn: "Piping & Mechanical Engineering",
      },
    }),
    prisma.category.upsert({
      where: { slug: "hvac" },
      update: {},
      create: { slug: "hvac", name: "التكييف والتبريد المركزي", nameEn: "Central HVAC & Refrigeration" },
    }),
    prisma.category.upsert({
      where: { slug: "engineering-software" },
      update: {},
      create: {
        slug: "engineering-software",
        name: "البرمجيات والنمذجة الهندسية",
        nameEn: "Engineering Software & Modeling",
      },
    }),
  ]);

  // Course 1: flagship piping & mechanical course — one section (lesson) per
  // topic (1-10). "الكتب" (books) are the individually-sold material
  // attachments within each lesson, not the lesson grouping itself. Keep the
  // "(English Name)" suffix on every entry — extractTitleEn() below parses it
  // into each section's titleEn so English-locale pages show a clean English
  // title instead of the full Arabic string.
  const LESSON_TITLES = [
    "الدرس 1: مقدمة في مصانع النفط والغاز والبتروكيماويات (Introduction to Oil, Gas & Petrochemical Plants)",
    "الدرس 2: هندسة المعدات الثابتة (Static Equipment Engineering)",
    "الدرس 3: هندسة مكونات الأنابيب (Piping Components Engineering)",
    "الدرس 4: هندسة المعدات الدوارة (Rotating Equipment Engineering)",
    "الدرس 5: الرسومات الهندسية وتخطيط المصانع (Engineering Drawings & Plant Layout)",
    "الدرس 6: الحسابات الهندسية اليدوية وتحليل الإجهادات (Manual Engineering Calculations & Stress Analysis)",
    "الدرس 7: التطبيقات البرمجية في تحليل الإجهادات (Software Applications in Stress Analysis)",
    "الدرس 8: النمذجة الثلاثية الأبعاد وبرمجيات تصميم المصانع (3D Modeling & Plant Design Software)",
    "الدرس 9: هندسة الأنابيب المتقدمة (Advanced Piping Engineering)",
    "الدرس 10: هندسة المشاريع وFEED وEPC (Project Engineering, FEED & EPC)",
  ];

  const pipingCourse = await prisma.course.upsert({
    where: { slug: "piping-mechanical-complete" },
    update: {},
    create: {
      slug: "piping-mechanical-complete",
      title: "الكورس الشامل في الأنابيب والهندسة الميكانيكية",
      titleEn: "The Comprehensive Course for Piping and Mechanical Engineering",
      subtitle: "10 كتب متكاملة تجعل منك مهندس أنابيب ومعدات ميكانيكية ثابتة ودوارة محترف",
      subtitleEn:
        "10 comprehensive books that build you into a professional piping and mechanical equipment engineer, covering both static and rotating machinery.",
      description:
        "برنامج تدريبي متكامل يغطي هندسة الأنابيب والمعدات الميكانيكية الثابتة والدوارة في مصانع النفط والغاز والبتروكيماويات، من الأساسيات النظرية إلى الحسابات اليدوية والتطبيقات البرمجية والنمذجة الثلاثية الأبعاد ورسومات الأيزومترك ومشاريع FEED و EPC.",
      price: 0,
      level: "INTERMEDIATE",
      published: true,
      order: 1,
      trainerId: admin.id,
      categoryId: pipingCategory.id,
      sections: {
        create: LESSON_TITLES.map((title, i) => {
          const en = extractTitleEn(title);
          return {
            title,
            titleEn: en ? `Lesson ${i + 1}: ${en}` : null,
            order: i + 1,
            lessons: { create: [{ title: "المحاضرة", titleEn: "Lecture", order: 1 }] },
          };
        }),
      },
    },
  });

  // Course 2: HVAC — ready as an upload slot per the user's request.
  const hvacCourse = await prisma.course.upsert({
    where: { slug: "central-hvac-systems" },
    update: {},
    create: {
      slug: "central-hvac-systems",
      title: "الدورة الشاملة في منظومات التكييف المركزي",
      titleEn: "The Comprehensive Course in Central HVAC Systems",
      subtitle: "مكونات وأنواع أنظمة التكييف، حساب أحمال التكييف، وتصميم الدكتينج",
      subtitleEn: "HVAC system components and types, cooling load calculations, and ductwork design",
      description:
        "دورة متكاملة في أنظمة التكييف المركزي: التعرف على المكونات والأنواع، طرق حساب الأحمال الحرارية، وأساسيات وتصميم شبكات الدكت (Ductwork).",
      price: 0,
      level: "INTERMEDIATE",
      published: false,
      order: 2,
      trainerId: admin.id,
      categoryId: hvacCategory.id,
      sections: {
        create: [
          {
            title: "الجزء الأول: أساسيات أنظمة التكييف المركزي",
            order: 1,
            lessons: {
              create: [
                { title: "مكونات وأنواع أنظمة التكييف المركزي", order: 1 },
                { title: "حساب الأحمال الحرارية (Cooling Load Calculations)", order: 2 },
                { title: "تصميم شبكات الدكت (Ductwork Design)", order: 3 },
              ],
            },
          },
        ],
      },
    },
  });

  // Course 3: SolidWorks for piping engineering.
  const solidworksCourse = await prisma.course.upsert({
    where: { slug: "solidworks-piping-engineering" },
    update: {},
    create: {
      slug: "solidworks-piping-engineering",
      title: "دورة SolidWorks في هندسة الأنابيب",
      titleEn: "SolidWorks for Piping Engineering",
      subtitle: "النمذجة الثلاثية الأبعاد لمكونات وشبكات الأنابيب باستخدام SolidWorks",
      subtitleEn: "3D modeling of piping components and networks using SolidWorks",
      description: "تطبيق عملي على برنامج SolidWorks في تصميم ونمذجة مكونات وشبكات الأنابيب.",
      price: 0,
      level: "INTERMEDIATE",
      published: false,
      order: 3,
      trainerId: admin.id,
      categoryId: softwareCategory.id,
      sections: {
        create: [
          {
            title: "الجزء الأول: أساسيات SolidWorks",
            order: 1,
            lessons: { create: [{ title: "أساسيات النمذجة والتجميعات في SolidWorks", order: 1 }] },
          },
        ],
      },
    },
  });

  // Course 4: Isometric piping drawings in AutoCAD.
  const autocadCourse = await prisma.course.upsert({
    where: { slug: "autocad-piping-isometrics" },
    update: {},
    create: {
      slug: "autocad-piping-isometrics",
      title: "عمل رسومات الأيزومترك للأنابيب بالأوتوكاد",
      titleEn: "Creating Piping Isometric Drawings with AutoCAD",
      subtitle: "قراءة ورسم مخططات الأيزومترك (Isometric) لشبكات الأنابيب باستخدام AutoCAD",
      subtitleEn: "Reading and drafting isometric drawings for piping networks using AutoCAD",
      description: "دورة عملية في قراءة وإعداد رسومات الأيزومترك لخطوط الأنابيب باستخدام AutoCAD.",
      price: 0,
      level: "BEGINNER",
      published: false,
      order: 4,
      trainerId: admin.id,
      categoryId: softwareCategory.id,
      sections: {
        create: [
          {
            title: "الجزء الأول: أساسيات الأيزومترك",
            order: 1,
            lessons: { create: [{ title: "أساسيات قراءة ورسم الأيزومترك في AutoCAD", order: 1 }] },
          },
        ],
      },
    },
  });

  const studentHash = await bcrypt.hash(STUDENT_PASSWORD, 10);
  const student = await prisma.user.upsert({
    where: { email: STUDENT_EMAIL },
    update: {},
    create: {
      name: "متدرب تجريبي",
      email: STUDENT_EMAIL,
      passwordHash: studentHash,
      role: "STUDENT",
    },
  });

  await prisma.enrollment.upsert({
    where: { userId_courseId: { userId: student.id, courseId: pipingCourse.id } },
    update: {},
    create: { userId: student.id, courseId: pipingCourse.id },
  });

  const STORY_SLIDES = [
    { imageUrl: "/defaults/story/slide-1.svg", caption: "من الأساسيات النظرية وقراءة المخططات الهندسية" },
    { imageUrl: "/defaults/story/slide-2.svg", caption: "إلى التطبيق العملي على المعدات والمشاريع الحقيقية" },
    { imageUrl: "/defaults/story/slide-3.svg", caption: "وصولًا إلى الاحترافية والجاهزية لسوق العمل" },
    { imageUrl: "/defaults/story/slide-4.svg", caption: "الحسابات الهندسية اليدوية وتحليل الإجهادات" },
    { imageUrl: "/defaults/story/slide-5.svg", caption: "النمذجة الثلاثية الأبعاد وبرمجيات التصميم" },
    { imageUrl: "/defaults/story/slide-6.svg", caption: "أنظمة التكييف المركزي والمعدات الدوارة" },
    { imageUrl: "/defaults/story/slide-7.svg", caption: "مشاريع حقيقية في الموقع والمكتب" },
    { imageUrl: "/defaults/story/slide-8.svg", caption: "انضم إلى مجتمع المتخصصين في الأكاديمية" },
  ];
  if ((await prisma.storyImage.count()) === 0) {
    await prisma.storyImage.createMany({
      data: STORY_SLIDES.map((s, i) => ({ ...s, order: i + 1 })),
    });
  }

  console.log("Seed complete.");
  console.log(`Admin login   -> ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
  console.log(`Student login -> ${STUDENT_EMAIL} / ${STUDENT_PASSWORD}`);
  console.log({
    pipingCourse: pipingCourse.slug,
    hvacCourse: hvacCourse.slug,
    solidworksCourse: solidworksCourse.slug,
    autocadCourse: autocadCourse.slug,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
