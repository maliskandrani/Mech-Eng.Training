import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateOwnProfile } from "@/lib/actions/user-actions";
import ProfileForm from "@/components/dashboard/ProfileForm";

export default async function AdminProfilePage() {
  const session = await auth();
  const user = await prisma.user.findUnique({ where: { id: session!.user.id } });

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-foreground">الملف الشخصي</h1>
      <p className="mt-1 text-muted">
        هذه البيانات تظهر في صفحتك الشخصية العامة (المدرب) وصفحات الدورات التي تديرها.
      </p>
      <div className="mt-6">
        <ProfileForm
          action={updateOwnProfile}
          initial={{ name: user!.name, title: user!.title, bio: user!.bio, phone: user!.phone }}
        />
      </div>
    </div>
  );
}
