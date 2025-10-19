import { useParams } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchCourse } from '../../lib/api/courses';
import { fetchLessonsByCourse } from '../../lib/api/lessons';
import { checkEnrollment, enrollInCourse } from '../../lib/api/enrollments';
import Button from '../../components/ui/Button';

export default function CourseDetailPage() {
  const { id } = useParams();
  const courseId = Number(id);
  const qc = useQueryClient();

  // fetch the course
  const courseQ = useQuery({
    queryKey: ['course', courseId],
    queryFn: () => fetchCourse(courseId),
    enabled: Number.isFinite(courseId),
  });

  // fetch lessons for this course
  const lessonsQ = useQuery({
    queryKey: ['lessons', courseId],
    queryFn: () => fetchLessonsByCourse(courseId),
    enabled: Number.isFinite(courseId),
  });

  // is user enrolled?
  const enrolledQ = useQuery({
    queryKey: ['enrolled', courseId],
    queryFn: () => checkEnrollment(courseId),
    enabled: Number.isFinite(courseId),
  });

  // mutation to enroll (with optimistic UI)
  const enrollMut = useMutation({
    mutationFn: () => enrollInCourse(courseId),
    onMutate: async () => {
      // cancel to avoid race with in-flight refetch
      await qc.cancelQueries({ queryKey: ['enrolled', courseId] });
      // get previous value
      const prev = qc.getQueryData<boolean>(['enrolled', courseId]);
      // optimistically set to true
      qc.setQueryData(['enrolled', courseId], true);
      // return rollback
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      // rollback to previous if error
      if (ctx?.prev !== undefined) qc.setQueryData(['enrolled', courseId], ctx.prev);
    },
    onSettled: () => {
      // ensure server truth in cache
      qc.invalidateQueries({ queryKey: ['enrolled', courseId] });
    },
  });

  if (courseQ.isLoading) return <p>Loading course…</p>;
  if (courseQ.isError || !courseQ.data) return <p className="text-red-600">Course not found.</p>;

  const course = courseQ.data;
  const lessons = lessonsQ.data ?? [];
  const enrolled = enrolledQ.data ?? false;

  return (
    <section className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{course.title}</h1>
          <p className="text-zinc-600 dark:text-zinc-300">{course.description}</p>
          <p className="text-xs text-zinc-500 mt-1">Starts: {new Date(course.startDate).toLocaleDateString()}</p>
        </div>

        <Button
          variant={enrolled ? 'ghost' : 'primary'}
          onClick={() => enrollMut.mutate()}
          disabled={enrolled || enrollMut.isPending}
          className="min-w-28"
        >
          {enrolled ? 'Enrolled ✓' : enrollMut.isPending ? 'Enrolling…' : 'Enroll'}
        </Button>
      </header>

      <section>
        <h2 className="text-xl font-semibold mb-2">Lessons</h2>
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
      </section>
    </section>
  );
}
