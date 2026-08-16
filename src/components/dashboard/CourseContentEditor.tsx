"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import SortableList from "@/components/dashboard/SortableList";
import SimpleAddForm from "@/components/dashboard/SimpleAddForm";
import MaterialUploadForm from "@/components/dashboard/MaterialUploadForm";
import CoverImageUpload from "@/components/dashboard/CoverImageUpload";
import InlineRename from "@/components/dashboard/InlineRename";
import { ConfirmDeleteButton } from "@/components/dashboard/ActionButtons";
import { MATERIAL_TYPE_LABELS } from "@/lib/utils";
import type { ActionResult } from "@/lib/actions/auth-actions";

type Material = {
  id: string;
  title: string;
  type: "BOOK" | "VIDEO" | "SLIDE";
};

type Lesson = {
  id: string;
  title: string;
  coverImageUrl: string | null;
  materials: Material[];
};

type Section = {
  id: string;
  title: string;
  coverImageUrl: string | null;
  lessons: Lesson[];
};

export default function CourseContentEditor({
  sections,
  isAdmin,
  createSection,
  deleteSection,
  reorderSections,
  updateSectionTitle,
  createLesson,
  deleteLesson,
  reorderLessons,
  updateLessonTitle,
  deleteMaterial,
  updateSectionCover,
  updateLessonCover,
}: {
  sections: Section[];
  isAdmin: boolean;
  createSection: (formData: FormData) => Promise<ActionResult>;
  deleteSection: (sectionId: string) => Promise<ActionResult>;
  reorderSections: (orderedIds: string[]) => Promise<ActionResult>;
  updateSectionTitle: (sectionId: string, formData: FormData) => Promise<ActionResult>;
  createLesson: (sectionId: string, formData: FormData) => Promise<ActionResult>;
  deleteLesson: (lessonId: string) => Promise<ActionResult>;
  reorderLessons: (sectionId: string, orderedIds: string[]) => Promise<ActionResult>;
  updateLessonTitle: (lessonId: string, formData: FormData) => Promise<ActionResult>;
  deleteMaterial: (materialId: string) => Promise<ActionResult>;
  updateSectionCover: (sectionId: string, formData: FormData) => Promise<ActionResult>;
  updateLessonCover: (lessonId: string, formData: FormData) => Promise<ActionResult>;
}) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  function runReorder(action: () => Promise<ActionResult>) {
    startTransition(async () => {
      await action();
      router.refresh();
    });
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-background-card p-4">
        <SimpleAddForm action={createSection} placeholder="عنوان قسم جديد" buttonLabel="+ إضافة قسم" />
      </div>

      <SortableList
        items={sections}
        onReorder={(ids) => runReorder(() => reorderSections(ids))}
        renderItem={(section, handle) => (
          <div className="rounded-2xl border border-border bg-background-card p-4">
            <div className="flex items-start gap-3">
              {isAdmin && (
                <CoverImageUpload
                  coverImageUrl={section.coverImageUrl}
                  action={updateSectionCover.bind(null, section.id)}
                />
              )}
              <div className="flex flex-1 items-center gap-2">
                <button
                  {...handle.attributes}
                  {...handle.listeners}
                  type="button"
                  data-role="section-handle"
                  className="cursor-grab touch-none rounded-lg border border-border px-2 py-1 text-muted active:cursor-grabbing"
                  title="اسحب لإعادة ترتيب الأقسام"
                >
                  ⠿
                </button>
                <InlineRename
                  value={section.title}
                  action={updateSectionTitle.bind(null, section.id)}
                  textClassName="font-bold text-foreground"
                />
                <ConfirmDeleteButton
                  onConfirm={() => deleteSection(section.id)}
                  confirmText="سيتم حذف القسم وكل دروسه وملفاته. هل أنت متأكد؟"
                />
              </div>
            </div>

            <div className="mt-3 space-y-3 border-r-2 border-border pr-4">
              <SimpleAddForm
                action={createLesson.bind(null, section.id)}
                placeholder="عنوان درس جديد"
                buttonLabel="+ إضافة درس"
                compact
              />

              <SortableList
                items={section.lessons}
                onReorder={(ids) => runReorder(() => reorderLessons(section.id, ids))}
                renderItem={(lesson, lessonHandle) => (
                  <div className="rounded-xl border border-border bg-background p-3">
                    <div className="flex items-start gap-2">
                      {isAdmin && (
                        <CoverImageUpload
                          coverImageUrl={lesson.coverImageUrl}
                          action={updateLessonCover.bind(null, lesson.id)}
                          size="sm"
                        />
                      )}
                      <div className="flex flex-1 items-center gap-2">
                        <button
                          {...lessonHandle.attributes}
                          {...lessonHandle.listeners}
                          type="button"
                          data-role="lesson-handle"
                          className="cursor-grab touch-none rounded-lg border border-border px-1.5 py-0.5 text-xs text-muted active:cursor-grabbing"
                          title="اسحب لإعادة ترتيب الدروس"
                        >
                          ⠿
                        </button>
                        <InlineRename
                          value={lesson.title}
                          action={updateLessonTitle.bind(null, lesson.id)}
                          textClassName="text-sm font-semibold text-foreground"
                        />
                        <ConfirmDeleteButton
                          onConfirm={() => deleteLesson(lesson.id)}
                          confirmText="سيتم حذف الدرس وكل ملفاته. هل أنت متأكد؟"
                        />
                      </div>
                    </div>

                    {lesson.materials.length > 0 && (
                      <ul className="mt-2 space-y-1.5">
                        {lesson.materials.map((mat) => (
                          <li
                            key={mat.id}
                            className="flex items-center justify-between rounded-lg border border-border bg-background-card px-3 py-1.5 text-sm"
                          >
                            <span className="text-foreground">{mat.title}</span>
                            <div className="flex items-center gap-2">
                              <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted">
                                {MATERIAL_TYPE_LABELS[mat.type] ?? mat.type}
                              </span>
                              <ConfirmDeleteButton onConfirm={deleteMaterial.bind(null, mat.id)} label="حذف" />
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}

                    <MaterialUploadForm lessonId={lesson.id} />
                  </div>
                )}
              />
              {section.lessons.length === 0 && (
                <p className="text-xs text-muted">لا توجد دروس في هذا القسم بعد.</p>
              )}
            </div>
          </div>
        )}
      />

      {sections.length === 0 && (
        <p className="text-sm text-muted">لا توجد أقسام بعد. أضف قسمًا للبدء في تنظيم محتوى الدورة.</p>
      )}
    </div>
  );
}
