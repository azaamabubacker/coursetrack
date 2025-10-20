import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { fetchCourse } from '../../lib/api/courses';
import CourseForm from './CourseForm';

export default function EditCoursePage() {
  const { id } = useParams();
  const courseId = Number(id);

  const q = useQuery({
    queryKey: ['course', courseId],
    queryFn: () => fetchCourse(courseId),
    enabled: Number.isFinite(courseId),
  });

  if (q.isLoading) return <p>Loading…</p>;
  if (q.isError || !q.data) return <p className="text-red-600">Course not found.</p>;

  // pass ISO startDate as string; the form coerces to Date
  return (
    <section>
      <h1 className="text-2xl font-bold mb-4">Edit course</h1>
      <CourseForm
        courseId={courseId}
        defaultValues={{
          title: q.data.title,
          description: q.data.description,
          startDate: q.data.startDate,
          contactPhone: q.data.contactPhone ?? '',
          thumbnail: q.data.thumbnail ?? '',
        }}
      />
    </section>
  );
}
