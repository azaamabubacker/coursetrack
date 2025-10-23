import { useParams } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchCourse } from '../../lib/api/courses';
import { fetchLessonsByCourse } from '../../lib/api/lessons';
import { checkEnrollment, enrollInCourse } from '../../lib/api/enrollments';
import Button from '../../components/ui/Button';
import { toast } from 'sonner';
import * as Tabs from '@radix-ui/react-tabs';
import * as Accordion from '@radix-ui/react-accordion';

export default function CourseDetailPage() {
  const { id } = useParams();
  const qc = useQueryClient();

  // --- queries (unchanged) ---
  const courseQ = useQuery({
    queryKey: ['course', id],
    queryFn: () => fetchCourse(id!),
    enabled: Boolean(id),
    retry: false,
  });

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

  if (courseQ.isLoading) return <p>Loading course…</p>;
  if (courseQ.isError || !courseQ.data) return <p className="text-red-600">Course not found.</p>;

  const course = courseQ.data;
  const lessons = lessonsQ.data ?? [];
  const enrolled = enrolledQ.data ?? false;

  return (
    <section className="space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div className="flex items-start gap-4">
          {course.thumbnail ? (
            <img
              src={course.thumbnail}
              alt={course.title || 'Course thumbnail'}
              className="h-20 w-20 rounded-md object-cover border border-zinc-200 dark:border-zinc-700"
            />
          ) : (
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

        <Button
          variant={enrolled ? 'ghost' : 'primary'}
          onClick={() => enrollMut.mutate()}
          disabled={enrolled || enrollMut.isPending || !hasNumericId}
          className="min-w-28"
        >
          {enrolled ? 'Enrolled ✓' : enrollMut.isPending ? 'Enrolling…' : 'Enroll'}
        </Button>
      </header>

      {/* Tabs */}
      <Tabs.Root defaultValue="overview" className="block">
        <Tabs.List className="flex gap-2 border-b border-zinc-200 dark:border-zinc-800 mb-4">
          {['overview', 'lessons', 'about'].map((tab) => (
            <Tabs.Trigger
              key={tab}
              value={tab}
              className="px-3 py-2 text-sm rounded-t-md data-[state=active]:bg-zinc-100 dark:data-[state=active]:bg-zinc-800
                         data-[state=active]:text-zinc-900 dark:data-[state=active]:text-zinc-100
                         text-zinc-600 dark:text-zinc-300"
            >
              {tab === 'overview' ? 'Overview' : tab === 'lessons' ? 'Lessons' : 'About'}
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        <Tabs.Content value="overview" className="space-y-3">
          <p className="text-zinc-700 dark:text-zinc-300">{course.description?.trim() || 'No description yet.'}</p>
          <Accordion.Root type="single" collapsible className="rounded-md">
            <Accordion.Item value="faq-1" className="border-b border-zinc-200 dark:border-zinc-800">
              <Accordion.Header>
                <Accordion.Trigger className="w-full text-left px-3 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-800">
                  What will I learn?
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="px-3 pb-3 text-sm text-zinc-600 dark:text-zinc-300">
                We’ll cover the fundamentals and build a small project.
              </Accordion.Content>
            </Accordion.Item>
            <Accordion.Item value="faq-2" className="border-b border-zinc-200 dark:border-zinc-800">
              <Accordion.Header>
                <Accordion.Trigger className="w-full text-left px-3 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-800">
                  Do I need prior experience?
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="px-3 pb-3 text-sm text-zinc-600 dark:text-zinc-300">
                Basic JavaScript knowledge helps, but we explain everything clearly.
              </Accordion.Content>
            </Accordion.Item>
          </Accordion.Root>
        </Tabs.Content>

        <Tabs.Content value="lessons" className="space-y-2">
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
        </Tabs.Content>

        <Tabs.Content value="about" className="space-y-2">
          <p className="text-sm text-zinc-600 dark:text-zinc-300">Contact: {course.contactPhone || '—'}</p>
        </Tabs.Content>
      </Tabs.Root>
    </section>
  );
}
