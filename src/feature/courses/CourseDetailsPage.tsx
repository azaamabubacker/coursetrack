import { useParams } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchCourse } from '../../lib/api/courses';
import { fetchLessonsByCourse } from '../../lib/api/lessons';
import { checkEnrollment, enrollInCourse } from '../../lib/api/enrollments';
import Button from '../../components/ui/Button';
import { toast } from 'sonner';

export default function CourseDetailPage() {
  const { id } = useParams(); // id can be "376f" (string)
  const qc = useQueryClient();

  // 1) Fetch this course (accepts string/number ids)
  const courseQ = useQuery({
    queryKey: ['course', id],
    queryFn: () => fetchCourse(id!), // id is defined because enabled uses Boolean(id)
    enabled: Boolean(id),
    retry: false,
  });

  // 2) Numeric-only resources (demo data for lessons/enrollments still keyed by number)
  const numericId = Number(id);
  const hasNumericId = Number.isFinite(numericId);

  const lessonsQ = useQuery({
    queryKey: ['lessons', id],
    queryFn: () => fetchLessonsByCourse(numericId),
    enabled: hasNumericId,
  });

  const enrolledQ = useQuery({
    queryKey: ['enrolled', id],
    queryFn: () => checkEnrollment(numericId),
    enabled: hasNumericId,
  });

  // 3) Enroll mutation (optimistic + toasts)
  const enrollMut = useMutation({
    mutationFn: () => {
      if (!hasNumericId) {
        toast.error('Enrollment requires numeric course id (demo data).');
        return Promise.reject(new Error('non-numeric id'));
      }
      return enrollInCourse(numericId);
    },
    onMutate: async () => {
      await qc.cancelQueries({ queryKey: ['enrolled', id] });
      const prev = qc.getQueryData<boolean>(['enrolled', id]);
      qc.setQueryData(['enrolled', id], true);
      return { prev };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.prev !== undefined) qc.setQueryData(['enrolled', id], ctx.prev);
      toast.error('Failed to enroll. Please try again.');
    },
    onSuccess: () => toast.success('Enrolled successfully!'),
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['enrolled', id] });
    },
  });

  // 4) Loading / error states
  if (courseQ.isLoading) return <p>Loading course…</p>;
  if (courseQ.isError || !courseQ.data) return <p className="text-red-600">Course not found.</p>;

  const course = courseQ.data;
  const lessons = lessonsQ.data ?? [];
  const enrolled = enrolledQ.data ?? false;

  return (
    <section className="space-y-6">
      <header className="flex items-center justify-between">
        <div className="flex items-start gap-4">
          {/* ✅ Thumbnail */}
          {course.thumbnail ? (
            <img
              src={course.thumbnail} // works with data: URLs or http(s)
              alt={course.title || 'Course thumbnail'}
              className="h-20 w-20 rounded-md object-cover border border-zinc-200 dark:border-zinc-700"
            />
          ) : (
            // optional placeholder box
            <div className="h-20 w-20 rounded-md border border-dashed border-zinc-300 dark:border-zinc-700 flex items-center justify-center text-xs text-zinc-500">
              No image
            </div>
          )}

          <div>
            <h1 className="text-3xl font-bold">{course.title?.trim() || 'Untitled course'}</h1>
            <p className="text-zinc-600 dark:text-zinc-300">{course.description?.trim() || 'No description yet.'}</p>
            <p className="text-xs text-zinc-500 mt-1">
              Starts: {course.startDate ? new Date(course.startDate).toLocaleDateString() : 'TBD'}
            </p>
          </div>
        </div>

        {/* Enroll button stays the same */}
        <Button
          variant={enrolled ? 'ghost' : 'primary'}
          onClick={() => enrollMut.mutate()}
          disabled={enrolled || enrollMut.isPending || !hasNumericId}
          className="min-w-28"
        >
          {enrolled ? 'Enrolled ✓' : enrollMut.isPending ? 'Enrolling…' : 'Enroll'}
        </Button>
      </header>

      <section>
        <h2 className="text-xl font-semibold mb-2">Lessons</h2>

        {hasNumericId ? (
          <>
            {lessonsQ.isLoading && <p>Loading lessons…</p>}
            {lessonsQ.isError && <p className="text-red-600">Failed to load lessons.</p>}

            <ul className="grid gap-2">
              {lessons.map((l) => (
                <li
                  key={l.id}
                  className="rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-3"
                >
                  {l.title}
                </li>
              ))}
            </ul>

            {lessons.length === 0 && !lessonsQ.isLoading && <p className="text-zinc-500">No lessons yet.</p>}
          </>
        ) : (
          <p className="text-zinc-500">Lessons are unavailable for string IDs in this demo.</p>
        )}
      </section>
    </section>
  );
}
