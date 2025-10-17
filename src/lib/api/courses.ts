import { api } from './client';
import type { Course } from './types';

export async function fetchCourses(params?: { page?: number; limit?: number; q?: string }) {
  const { page = 1, limit = 10, q } = params ?? {};
  const r = await api.get<Course[]>('/courses', {
    params: { _page: page, _limit: limit, q },
    cache: { ttl: 30_000 },
  });
  return r.data;
}

export async function fetchCourse(id: number) {
  const r = await api.get<Course>(`/courses/${id}`, { cache: { ttl: 60_000 } });
  return r.data;
}
