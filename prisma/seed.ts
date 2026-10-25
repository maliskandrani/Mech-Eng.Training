import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const ADMIN_EMAIL = "albarasi37@gmail.com";
const ADMIN_PASSWORD = "MR_2026";
const STUDENT_EMAIL = "student@example.com";
const STUDENT_PASSWORD = "Student123!";

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
      bioEn:
        "A mechanical engineer specializing in piping and mechanical equipment engineering across the oil, gas, and petrochemical sector, with many years of experience in design, execution, and engineering consulting — and the founder of SkillStream Academy.",
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

  // Course 1: flagship piping & mechanical course — 6 parts (sections), each
  // broken into its full lesson-level table of contents (one Lesson row per
  // topic — a course page, not a book chapter). This is the detailed
  // curriculum outline the trainer authored; each lesson still holds no
  // Material yet — those get uploaded later as the actual content is written.
  const PIPING_BOOKS: { ar: string; en: string; chapters: { ar: string; en: string }[] }[] = [
    {
      ar: "مقدمة مختصرة في صناعة النفط والغاز",
      en: "Introduction to Oil, Gas & Petrochemical Plants",
      chapters: [
        {
          ar: "الدرس 1: مقدمة إلى صناعة النفط والغاز والبتروكيماويات",
          en: "Lesson 1: Introduction to the Oil, Gas & Petrochemical Industry",
        },
        {
          ar: "الدرس 2: الجيولوجيا البترولية ومكامن النفط والغاز",
          en: "Lesson 2: Petroleum Geology & Reservoir Fundamentals",
        },
        {
          ar: "الدرس 3: مراحل صناعة النفط والغاز: من المنبع إلى المصب",
          en: "Lesson 3: Upstream, Midstream & Downstream Operations",
        },
        {
          ar: "الدرس 4: الخصائص الفيزيائية والكيميائية للنفط والغاز",
          en: "Lesson 4: Physical & Chemical Properties of Oil and Gas",
        },
        {
          ar: "الدرس 5: منشآت الإنتاج ومعالجة النفط والغاز",
          en: "Lesson 5: Oil & Gas Production Facilities and Processing",
        },
        { ar: "الدرس 6: أساسيات صناعة تكرير النفط", en: "Lesson 6: Fundamentals of Petroleum Refining" },
        { ar: "الدرس 7: أساسيات صناعة البتروكيماويات", en: "Lesson 7: Petrochemical Industry Fundamentals" },
        {
          ar: "الدرس 8: المعدات الرئيسية في المنشآت الصناعية",
          en: "Lesson 8: Major Equipment in Oil, Gas & Petrochemical Plants",
        },
        {
          ar: "الدرس 9: مقدمة إلى أنظمة الأنابيب الصناعية",
          en: "Lesson 9: Introduction to Industrial Piping Systems",
        },
        {
          ar: "الدرس 10: مقدمة إلى أنظمة التحكم والأجهزة الصناعية",
          en: "Lesson 10: Introduction to Instrumentation & Process Control",
        },
        {
          ar: "الدرس 11: السلامة الصناعية والمخاطر في منشآت النفط والغاز",
          en: "Lesson 11: Industrial Safety & Process Hazards",
        },
        {
          ar: "الدرس 12: البيئة وكفاءة الطاقة والاستدامة الصناعية",
          en: "Lesson 12: Environmental Protection, Energy Efficiency & Sustainability",
        },
        {
          ar: "الدرس 13: قراءة المخططات والوثائق الهندسية الأساسية",
          en: "Lesson 13: Introduction to Engineering Drawings & Documents",
        },
        {
          ar: "الدرس 14: الأكواد والمعايير والمصطلحات الهندسية الشائعة",
          en: "Lesson 14: Engineering Codes, Standards & Industry Terminology",
        },
        {
          ar: "الدرس 15: دراسة حالة متكاملة لمنشأة نفط وغاز",
          en: "Lesson 15: Integrated Oil & Gas Plant Case Study",
        },
      ],
    },
    {
      ar: "أساسيات هندسة الأنابيب",
      en: "Fundamentals of Piping Engineering",
      chapters: [
        { ar: "الدرس 1: مقدمة في هندسة الأنابيب", en: "Lesson 1: Introduction to Piping Engineering" },
        { ar: "الدرس 2: أكواد ومعايير الأنابيب", en: "Lesson 2: Piping Codes and Standards" },
        { ar: "الدرس 3: مواد الأنابيب وطرق التصنيع", en: "Lesson 3: Pipe Materials and Manufacturing Types" },
        { ar: "الدرس 4: أبعاد الأنابيب وتصنيفات الضغط", en: "Lesson 4: Pipe Dimensions and Ratings" },
        {
          ar: "الدرس 5: مواصفات الأنابيب وتصنيف الخطوط",
          en: "Lesson 5: Piping Specifications and Line Classification",
        },
        { ar: "الدرس 6: أساسيات أنظمة الأنابيب", en: "Lesson 6: Piping System Fundamentals" },
        { ar: "الدرس 7: نظرة عامة على التركيب ودورة الحياة", en: "Lesson 7: Installation and Lifecycle Overview" },
      ],
    },
    {
      ar: "رسومات الأنابيب والمخططات وتخطيط المنشآت",
      en: "Piping Drawings, Diagrams & Plant Layout",
      chapters: [
        { ar: "الدرس 1: أساسيات الرسومات الهندسية", en: "Lesson 1: Engineering Drawings Fundamentals" },
        { ar: "الدرس 2: المخططات الإجرائية (PFD وP&ID)", en: "Lesson 2: Process Diagrams" },
        { ar: "الدرس 3: رموز واختصارات الأنابيب", en: "Lesson 3: Piping Symbols and Abbreviations" },
        { ar: "الدرس 4: رسومات ترتيب الأنابيب", en: "Lesson 4: Piping Arrangement Drawings" },
        { ar: "الدرس 5: الرسومات الأيزومترية والمسقطة", en: "Lesson 5: Isometric and Orthographic Drawings" },
        { ar: "الدرس 6: المستندات والقوائم المساندة", en: "Lesson 6: Supporting Documents and Lists" },
        { ar: "الدرس 7: التطبيق العملي لقراءة الرسومات", en: "Lesson 7: Practical Drawing Interpretation" },
      ],
    },
    {
      ar: "مكونات الأنابيب وملحقاتها",
      en: "Piping Components, Fittings & Accessories",
      chapters: [
        {
          ar: "الدرس 1: أنواع الأنابيب وتصنيف المكونات",
          en: "Lesson 1: Pipe Types and Component Classification",
        },
        { ar: "الدرس 2: وصلات الأنابيب (الفيتنجز)", en: "Lesson 2: Pipe Fittings" },
        { ar: "الدرس 3: الفلانشات والوصلات", en: "Lesson 3: Flanges and Connections" },
        { ar: "الدرس 4: الصمامات", en: "Lesson 4: Valves" },
        { ar: "الدرس 5: المكونات الخاصة للأنابيب", en: "Lesson 5: Special Piping Components" },
        { ar: "الدرس 6: دعامات الأنابيب وملحقاتها", en: "Lesson 6: Pipe Supports and Accessories" },
        { ar: "الدرس 7: اختيار المكونات والتعرف عليها", en: "Lesson 7: Component Selection and Identification" },
      ],
    },
    {
      ar: "المعدات الدوارة: الأنواع والتطبيقات",
      en: "Rotating Equipment Engineering — Types & Applications",
      chapters: [
        { ar: "الدرس 1: مقدمة في المعدات الدوارة", en: "Lesson 1: Introduction to Rotating Equipment" },
        { ar: "الدرس 2: المضخات", en: "Lesson 2: Pumps" },
        { ar: "الدرس 3: الضواغط", en: "Lesson 3: Compressors" },
        { ar: "الدرس 4: التوربينات والموسعات", en: "Lesson 4: Turbines and Expanders" },
        { ar: "الدرس 5: المحركات القائدة ونقل الحركة", en: "Lesson 5: Drivers and Power Transmission" },
        {
          ar: "الدرس 6: الأنظمة المساندة والمكونات المشتركة",
          en: "Lesson 6: Auxiliary Systems and Common Components",
        },
        { ar: "الدرس 7: التشغيل والموثوقية والصيانة", en: "Lesson 7: Operation, Reliability and Maintenance" },
      ],
    },
    {
      ar: "المعدات الثابتة: الأنواع والتطبيقات",
      en: "Static Equipment Engineering — Types & Applications",
      chapters: [
        { ar: "الدرس 1: مقدمة في المعدات الثابتة", en: "Lesson 1: Introduction to Static Equipment" },
        { ar: "الدرس 2: أوعية الضغط", en: "Lesson 2: Pressure Vessels" },
        { ar: "الدرس 3: خزانات التخزين", en: "Lesson 3: Storage Tanks" },
        { ar: "الدرس 4: المبادلات الحرارية", en: "Lesson 4: Heat Exchangers" },
        {
          ar: "الدرس 5: الأعمدة والأبراج والمكونات الداخلية",
          en: "Lesson 5: Columns, Towers and Process Internals",
        },
        {
          ar: "الدرس 6: الغلايات والسخانات والمعدات الحرارية",
          en: "Lesson 6: Boilers, Fired Heaters and Thermal Equipment",
        },
        { ar: "الدرس 7: معدات ثابتة أخرى", en: "Lesson 7: Other Static Equipment" },
        {
          ar: "الدرس 8: نظرة عامة على التركيب والتشغيل والصيانة",
          en: "Lesson 8: Installation, Operation and Maintenance Overview",
        },
      ],
    },
  ];

  const pipingCourse = await prisma.course.upsert({
    where: { slug: "piping-mechanical-complete" },
    update: {},
    create: {
      slug: "piping-mechanical-complete",
      title: "الكورس الشامل في الأنابيب والهندسة الميكانيكية",
      titleEn: "The Comprehensive Course for Piping and Mechanical Engineering",
      subtitle: "6 كتب مترابطة تؤسس معرفتك في هندسة الأنابيب والمعدات الميكانيكية بمنشآت النفط والغاز",
      subtitleEn:
        "6 interconnected books building your foundation in piping and mechanical equipment engineering for oil & gas facilities.",
      description:
        "برنامج تأسيسي مترابط يغطي المعرفة التي يحتاجها مهندس الأنابيب والهندسة الميكانيكية في منشآت النفط والغاز والبتروكيماويات: من مدخل إلى الصناعة، إلى أساسيات الأنابيب ورسوماتها ومكوناتها، وصولًا إلى المعدات الدوارة والثابتة وتطبيقاتها — دون التوسع في التصميم التفصيلي أو التصنيع أو المحاكاة والاختبارات.",
      descriptionEn:
        "A connected foundational program covering what a piping and mechanical engineer needs to know in oil, gas, and petrochemical facilities: from an industry overview, through piping fundamentals, drawings, and components, to rotating and static equipment types and applications — without going into detailed design, manufacturing, simulation, or testing.",
      price: 0,
      level: "INTERMEDIATE",
      published: true,
      order: 1,
      trainerId: admin.id,
      categoryId: pipingCategory.id,
      sections: {
        create: PIPING_BOOKS.map((book, i) => ({
          title: `الجزء ${i + 1}: ${book.ar} (${book.en})`,
          titleEn: `Section ${i + 1}: ${book.en}`,
          order: i + 1,
          lessons: {
            create: book.chapters.map((ch, j) => ({
              title: ch.ar,
              titleEn: ch.en,
              order: j + 1,
            })),
          },
        })),
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
      descriptionEn:
        "A complete course on central HVAC systems: an introduction to their components and types, methods for calculating thermal loads, and the fundamentals and design of ductwork networks.",
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
      descriptionEn: "Hands-on practice with SolidWorks for designing and modeling piping components and networks.",
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
      descriptionEn: "A practical course on reading and preparing isometric drawings for piping lines using AutoCAD.",
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

  // Course 5: Piping Stress Analysis — standalone specialist course split out
  // of the flagship curriculum per the trainer's request.
  const stressCourse = await prisma.course.upsert({
    where: { slug: "piping-stress-analysis" },
    update: {},
    create: {
      slug: "piping-stress-analysis",
      title: "دورة تحليل إجهادات الأنابيب",
      titleEn: "Piping Stress Analysis",
      subtitle: "دراسة متخصصة في مرونة الأنابيب وتحليل الإجهادات والأحمال باستخدام الأسس الهندسية والبرامج المتخصصة",
      subtitleEn:
        "A focused study of piping flexibility, stress and load analysis using engineering fundamentals and specialized software.",
      description:
        "دراسة مستقلة تشمل المرونة والإجهادات والأحمال والدعامات والتمدد الحراري في أنظمة الأنابيب، ثم مقدمة في التحليل باستخدام البرامج المتخصصة عند الحاجة.",
      descriptionEn:
        "An independent study covering flexibility, stresses, loads, supports, and thermal expansion in piping systems, followed by an introduction to specialized stress-analysis software.",
      price: 0,
      level: "ADVANCED",
      published: false,
      order: 5,
      trainerId: admin.id,
      categoryId: pipingCategory.id,
      sections: {
        create: [
          {
            title: "الجزء 1: مقدمة في تحليل إجهادات الأنابيب (Introduction to Piping Stress Analysis)",
            titleEn: "Section 1: Introduction to Piping Stress Analysis",
            order: 1,
            lessons: { create: [{ title: "المحاضرة", titleEn: "Lecture", order: 1 }] },
          },
          {
            title: "الجزء 2: المرونة في أنظمة الأنابيب (Piping Flexibility Fundamentals)",
            titleEn: "Section 2: Piping Flexibility Fundamentals",
            order: 2,
            lessons: { create: [{ title: "المحاضرة", titleEn: "Lecture", order: 1 }] },
          },
          {
            title: "الجزء 3: الأحمال والإجهادات المسموحة (Loads and Allowable Stresses)",
            titleEn: "Section 3: Loads and Allowable Stresses",
            order: 3,
            lessons: { create: [{ title: "المحاضرة", titleEn: "Lecture", order: 1 }] },
          },
          {
            title: "الجزء 4: التمدد الحراري ودعامات الأنابيب (Thermal Expansion & Pipe Supports)",
            titleEn: "Section 4: Thermal Expansion & Pipe Supports",
            order: 4,
            lessons: { create: [{ title: "المحاضرة", titleEn: "Lecture", order: 1 }] },
          },
          {
            title: "الجزء 5: تحليل الإجهادات بالبرامج المتخصصة (Computerized Stress Analysis — CAESAR II)",
            titleEn: "Section 5: Computerized Stress Analysis — CAESAR II",
            order: 5,
            lessons: { create: [{ title: "المحاضرة", titleEn: "Lecture", order: 1 }] },
          },
          {
            title: "الجزء 6: حالات عملية ودراسات تطبيقية (Practical Case Studies)",
            titleEn: "Section 6: Practical Case Studies",
            order: 6,
            lessons: { create: [{ title: "المحاضرة", titleEn: "Lecture", order: 1 }] },
          },
        ],
      },
    },
  });

  // Course 6: CAD & Engineering Drafting — standalone drafting-skills course.
  const cadCourse = await prisma.course.upsert({
    where: { slug: "cad-engineering-drafting" },
    update: {},
    create: {
      slug: "cad-engineering-drafting",
      title: "دورة الرسم الهندسي بالحاسوب (CAD)",
      titleEn: "CAD & Engineering Drafting",
      subtitle: "إتقان الرسم الهندسي بالحاسوب وإعداد المخططات الفنية الاحترافية للأنابيب والمنشآت",
      subtitleEn: "Master computer-aided drafting and produce professional technical drawings for piping and facilities.",
      description:
        "دورة عملية في رسم المخططات الهندسية، وإعداد الرسومات ثنائية الأبعاد، وتنظيم الطبقات والأبعاد والطباعة، وصولًا إلى إعداد رسومات فنية احترافية للأنابيب.",
      descriptionEn:
        "A hands-on course in drawing engineering plans, preparing 2D drawings, organizing layers, dimensions, and plotting, culminating in professional piping technical drawings.",
      price: 0,
      level: "BEGINNER",
      published: false,
      order: 6,
      trainerId: admin.id,
      categoryId: softwareCategory.id,
      sections: {
        create: [
          {
            title: "الجزء 1: أساسيات الرسم الهندسي بالحاسوب (Introduction to CAD & Engineering Drafting)",
            titleEn: "Section 1: Introduction to CAD & Engineering Drafting",
            order: 1,
            lessons: { create: [{ title: "المحاضرة", titleEn: "Lecture", order: 1 }] },
          },
          {
            title: "الجزء 2: أدوات الرسم ثنائي الأبعاد (2D Drafting Tools & Commands)",
            titleEn: "Section 2: 2D Drafting Tools & Commands",
            order: 2,
            lessons: { create: [{ title: "المحاضرة", titleEn: "Lecture", order: 1 }] },
          },
          {
            title: "الجزء 3: الطبقات والأبعاد والتدوين (Layers, Dimensioning & Annotation)",
            titleEn: "Section 3: Layers, Dimensioning & Annotation",
            order: 3,
            lessons: { create: [{ title: "المحاضرة", titleEn: "Lecture", order: 1 }] },
          },
          {
            title: "الجزء 4: إعداد المخططات الهندسية للطباعة (Plotting & Drawing Sheet Setup)",
            titleEn: "Section 4: Plotting & Drawing Sheet Setup",
            order: 4,
            lessons: { create: [{ title: "المحاضرة", titleEn: "Lecture", order: 1 }] },
          },
          {
            title: "الجزء 5: رسم مخططات الأنابيب والأيزومترك بالأوتوكاد (Piping & Isometric Drawings with AutoCAD)",
            titleEn: "Section 5: Piping & Isometric Drawings with AutoCAD",
            order: 5,
            lessons: { create: [{ title: "المحاضرة", titleEn: "Lecture", order: 1 }] },
          },
        ],
      },
    },
  });

  // Course 7: 3D Modeling & Plant Design — standalone 3D-modeling course.
  const modeling3dCourse = await prisma.course.upsert({
    where: { slug: "plant-3d-modeling-design" },
    update: {},
    create: {
      slug: "plant-3d-modeling-design",
      title: "دورة النمذجة الثلاثية الأبعاد وتصميم المصانع",
      titleEn: "3D Modeling & Plant Design",
      subtitle: "نمذجة المصانع وخطوط الأنابيب ثلاثية الأبعاد واستخراج الرسومات وقوائم المواد باحتراف",
      subtitleEn: "3D model plants and piping networks, and professionally extract drawings and material take-offs.",
      description:
        "دورة عملية في نمذجة الأنابيب والمنشآت ثلاثية الأبعاد، وتنسيق المعدات والخطوط بين التخصصات، واستخراج الرسومات وقوائم المواد باستخدام البرامج المناسبة.",
      descriptionEn:
        "A hands-on course in 3D modeling of piping and facilities, coordinating equipment and lines across disciplines, and extracting drawings and material lists using the appropriate software.",
      price: 0,
      level: "INTERMEDIATE",
      published: false,
      order: 7,
      trainerId: admin.id,
      categoryId: softwareCategory.id,
      sections: {
        create: [
          {
            title: "الجزء 1: مقدمة في النمذجة الثلاثية الأبعاد للمصانع (Introduction to 3D Plant Modeling)",
            titleEn: "Section 1: Introduction to 3D Plant Modeling",
            order: 1,
            lessons: { create: [{ title: "المحاضرة", titleEn: "Lecture", order: 1 }] },
          },
          {
            title: "الجزء 2: نمذجة خطوط الأنابيب والمعدات (Piping & Equipment Modeling)",
            titleEn: "Section 2: Piping & Equipment Modeling",
            order: 2,
            lessons: { create: [{ title: "المحاضرة", titleEn: "Lecture", order: 1 }] },
          },
          {
            title: "الجزء 3: تنسيق التخصصات داخل النموذج (Multi-Discipline Model Coordination)",
            titleEn: "Section 3: Multi-Discipline Model Coordination",
            order: 3,
            lessons: { create: [{ title: "المحاضرة", titleEn: "Lecture", order: 1 }] },
          },
          {
            title: "الجزء 4: استخراج الرسومات وقوائم المواد (Drawing Extraction & Bill of Materials)",
            titleEn: "Section 4: Drawing Extraction & Bill of Materials",
            order: 4,
            lessons: { create: [{ title: "المحاضرة", titleEn: "Lecture", order: 1 }] },
          },
          {
            title: "الجزء 5: تطبيق عملي باستخدام SolidWorks (Practical Application with SolidWorks)",
            titleEn: "Section 5: Practical Application with SolidWorks",
            order: 5,
            lessons: { create: [{ title: "المحاضرة", titleEn: "Lecture", order: 1 }] },
          },
        ],
      },
    },
  });

  // Course 8: Project Engineering, FEED & EPC — standalone project-engineering course.
  const projectEngCourse = await prisma.course.upsert({
    where: { slug: "project-engineering-feed-epc" },
    update: {},
    create: {
      slug: "project-engineering-feed-epc",
      title: "دورة هندسة المشاريع: من FEED إلى EPC",
      titleEn: "Project Engineering, FEED & EPC",
      subtitle: "من التصميم الهندسي الأساسي إلى التنفيذ: فهم عملي لمراحل المشاريع الصناعية وتنسيقها وتسليماتها",
      subtitleEn:
        "From basic engineering design to execution: a practical understanding of industrial project phases, coordination, and deliverables.",
      description:
        "دورة تغطي مراحل المشروع الهندسي، والمستندات الهندسية، والتنسيق بين التخصصات، ونطاق العمل، وإدارة التعديلات، والتسليمات الهندسية من FEED إلى EPC.",
      descriptionEn:
        "A course covering the phases of an engineering project, engineering documents, interdisciplinary coordination, scope of work, change management, and engineering deliverables from FEED to EPC.",
      price: 0,
      level: "ADVANCED",
      published: false,
      order: 8,
      trainerId: admin.id,
      categoryId: pipingCategory.id,
      sections: {
        create: [
          {
            title: "الجزء 1: مقدمة في مراحل المشاريع الهندسية (Introduction to Project Engineering Phases)",
            titleEn: "Section 1: Introduction to Project Engineering Phases",
            order: 1,
            lessons: { create: [{ title: "المحاضرة", titleEn: "Lecture", order: 1 }] },
          },
          {
            title: "الجزء 2: الهندسة الأساسية (FEED) (Front-End Engineering Design — FEED)",
            titleEn: "Section 2: Front-End Engineering Design — FEED",
            order: 2,
            lessons: { create: [{ title: "المحاضرة", titleEn: "Lecture", order: 1 }] },
          },
          {
            title: "الجزء 3: نطاق العمل والمستندات الهندسية (Scope of Work & Engineering Documents)",
            titleEn: "Section 3: Scope of Work & Engineering Documents",
            order: 3,
            lessons: { create: [{ title: "المحاضرة", titleEn: "Lecture", order: 1 }] },
          },
          {
            title: "الجزء 4: التنسيق بين التخصصات الهندسية (Interdisciplinary Coordination)",
            titleEn: "Section 4: Interdisciplinary Coordination",
            order: 4,
            lessons: { create: [{ title: "المحاضرة", titleEn: "Lecture", order: 1 }] },
          },
          {
            title: "الجزء 5: إدارة التعديلات والتسليمات الهندسية (Change Management & Engineering Deliverables)",
            titleEn: "Section 5: Change Management & Engineering Deliverables",
            order: 5,
            lessons: { create: [{ title: "المحاضرة", titleEn: "Lecture", order: 1 }] },
          },
          {
            title: "الجزء 6: من الهندسة التفصيلية إلى التنفيذ (EPC) (From Detailed Engineering to EPC Execution)",
            titleEn: "Section 6: From Detailed Engineering to EPC Execution",
            order: 6,
            lessons: { create: [{ title: "المحاضرة", titleEn: "Lecture", order: 1 }] },
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
    stressCourse: stressCourse.slug,
    cadCourse: cadCourse.slug,
    modeling3dCourse: modeling3dCourse.slug,
    projectEngCourse: projectEngCourse.slug,
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
