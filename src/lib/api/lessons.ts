import { api } from './client';
import type { Lesson } from './types';

export async function fetchLessonsByCourse(courseId: number) {
  const r = api.get<Lesson[]>('/lessons', {
    params: { courseId },
    cache: { ttl: 60_000 },
  });
  return (await r).data;
}
