import { api } from './client';

export type Enrollment = {
  id: number;
  courseId: number;
  userId: number;
};

const USER_ID = 1;

export async function enrollInCourse(courseId: number) {
  const r = api.post<Enrollment>('/enrollments', {
    courseId,
    userId: USER_ID,
  });
  return (await r).data;
}

export async function checkEnrollment(courseId: number) {
  const r = api.get<Enrollment[]>('/enrollments', {
    params: {
      courseId,
      userId: USER_ID,
    },
  });
  return (await r).data.length > 0;
}
