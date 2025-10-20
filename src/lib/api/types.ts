export type Course = {
  id: number | string;
  title: string;
  description: string;
  startDate: string;
  contactPhone?: string | null;
  thumbnail?: string | null;
};

export type Lesson = {
  id: number;
  courseId: number;
  title: string;
};
