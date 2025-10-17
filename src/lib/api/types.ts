export type Course = {
  id: number;
  title: string;
  description: string;
  startDate: string;
};

export type Lesson = {
  id: number;
  courseId: number;
  title: string;
};
