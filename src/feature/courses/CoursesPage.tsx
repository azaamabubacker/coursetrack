import { useQuery } from '@tanstack/react-query';
import { fetchCourses } from '../../lib/api/courses';
import { useState } from 'react';

export default function CoursesPage() {
  const [search, setSearch] = useState<string>('');

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['courses', { q: search }],
    queryFn: () => fetchCourses({ page: 1, limit: 20, q: search || undefined }),
  });

  return (
    <section>
      <h1 className="text-3xl font-bold mb-4">Courses</h1>
      <div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search courses.."
          className="w-full max-w-xs rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 outline-none focus-ring-1 focus-ring-blue-600"
        />
        <button
          onClick={() => refetch}
          className="rounded-md bg-blue-600 text-white px-4 py-2 disabled-opacity-50 disabled"
          disabled={isFetching}
        >
          {isFetching ? 'Searching..' : 'Search'}
        </button>
      </div>
      {isLoading && <p>Loading..</p>}
      {isError && <p className="text-red-600">Failed to load courses</p>}
      <ul className="grid gap-3">
        {data?.map((c) => (
          <li key={c.id} className="rounded-md border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-4 mt-5">
            <div className="font-semibold text-lg">{c.title}</div>
            <div className="text-sm text-zinc-600 dark:text-zinc-300">{c.description}</div>
            <div className="text-xs text-zing-500 mt-1">Starts {new Date(c.startDate).toLocaleDateString()}</div>
          </li>
        ))}
      </ul>
    </section>
  );
}
