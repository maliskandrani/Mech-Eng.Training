import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateOwnProfile } from "@/lib/actions/user-actions";
import ProfileForm from "@/components/dashboard/ProfileForm";

export default async function TrainerProfilePage() {
  const session = await auth();
  const user = await prisma.user.findUnique({ where: { id: session!.user.id } });

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-foreground">الملف الشخصي</h1>
      <p className="mt-1 text-muted">هذه البيانات تظهر للمتدربين في صفحتك الشخصية وصفحات دوراتك.</p>
      <div className="mt-6">
        <ProfileForm
          action={updateOwnProfile}
          initial={{
            name: user!.name,
            nameEn: user!.nameEn,
            designation: user!.designation,
            title: user!.title,
            titleEn: user!.titleEn,
            bio: user!.bio,
            phone: user!.phone,
          }}
        />
      </div>
    </div>
  );
}
