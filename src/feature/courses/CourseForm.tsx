import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/style.css';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCourse, updateCourse } from '../../lib/api/courses';
import { format } from 'date-fns';
import { useNavigate } from 'react-router';
import { useCallback, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';

const schema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  startDate: z.date({ required_error: 'Pick a start date' }),
  contactPhone: z.string().optional().nullable(),
  thumbnail: z.string().optional().nullable(), // data URL
});

export type CourseFormValues = z.infer<typeof schema>;

type Props = {
  defaultValues?: Partial<CourseFormValues>;
  courseId?: number; // if provided -> edit mode
};

export default function CourseForm({ defaultValues, courseId }: Props) {
  const navigate = useNavigate();
  const qc = useQueryClient();

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      startDate: new Date(),
      contactPhone: '',
      thumbnail: '',
      ...defaultValues,
      // if defaultValues.startDate is ISO string, coerce to Date
      startDate:
        defaultValues?.startDate instanceof Date
          ? defaultValues.startDate
          : defaultValues?.startDate
          ? new Date(defaultValues.startDate as unknown as string)
          : new Date(),
    },
    mode: 'onBlur',
  });

  // create OR update mutation
  const createMut = useMutation({
    mutationFn: (values: CourseFormValues) =>
      createCourse({
        title: values.title,
        description: values.description,
        startDate: format(values.startDate, 'yyyy-MM-dd'),
        contactPhone: values.contactPhone || null,
        thumbnail: values.thumbnail || null,
      }),
    onSuccess: (course) => {
      toast.success('Course created!');
      // keep lists fresh
      qc.invalidateQueries({ queryKey: ['courses'] });
      navigate(`/courses/${course.id}`);
    },
    onError: () => toast.error('Failed to create course'),
  });

  const updateMut = useMutation({
    mutationFn: (values: CourseFormValues) =>
      updateCourse(courseId!, {
        title: values.title,
        description: values.description,
        startDate: format(values.startDate, 'yyyy-MM-dd'),
        contactPhone: values.contactPhone || null,
        thumbnail: values.thumbnail || null,
      }),
    onSuccess: (course) => {
      toast.success('Course updated!');
      qc.invalidateQueries({ queryKey: ['courses'] });
      qc.invalidateQueries({ queryKey: ['course', course.id] });
      navigate(`/courses/${course.id}`);
    },
    onError: () => toast.error('Failed to update course'),
  });

  const onSubmit = (values: CourseFormValues) => {
    if (courseId) updateMut.mutate(values);
    else createMut.mutate(values);
  };

  // thumbnail dropzone
  const onDrop = useCallback(
    (files: File[]) => {
      const file = files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        form.setValue('thumbnail', reader.result as string, { shouldDirty: true });
      };
      reader.readAsDataURL(file);
    },
    [form]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    multiple: false,
    onDrop,
  });

  const submitting = useMemo(
    () => createMut.isPending || updateMut.isPending,
    [createMut.isPending, updateMut.isPending]
  );

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-xl">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <input
          {...form.register('title')}
          className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 outline-none focus:ring-1 focus:ring-blue-600"
          placeholder="React Fundamentals"
        />
        {form.formState.errors.title && <p className="text-sm text-red-600">{form.formState.errors.title.message}</p>}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          {...form.register('description')}
          rows={4}
          className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 outline-none focus:ring-1 focus:ring-blue-600"
          placeholder="Short summary of the course…"
        />
        {form.formState.errors.description && (
          <p className="text-sm text-red-600">{form.formState.errors.description.message}</p>
        )}
      </div>

      {/* Start date (DayPicker) */}
      <div>
        <label className="block text-sm font-medium mb-1">Start Date</label>
        <Controller
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <div className="rounded-md border border-zinc-300 dark:border-zinc-700 p-2 inline-block bg-white dark:bg-zinc-800">
              <DayPicker mode="single" selected={field.value} onSelect={(d) => field.onChange(d ?? new Date())} />
            </div>
          )}
        />
        {form.formState.errors.startDate && (
          <p className="text-sm text-red-600">{form.formState.errors.startDate.message as string}</p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-medium mb-1">Contact Phone</label>
        <Controller
          control={form.control}
          name="contactPhone"
          render={({ field }) => (
            <div className="w-full">
              <PhoneInput
                value={field.value ?? ''}
                onChange={(val) => field.onChange(val ?? '')}
                defaultCountry="US"
                international
                className="PhoneInput w-full"
              />
            </div>
          )}
        />
      </div>

      {/* Thumbnail upload (react-dropzone) */}
      <div>
        <label className="block text-sm font-medium mb-1">Thumbnail</label>
        <div
          {...getRootProps()}
          className="cursor-pointer rounded-md border border-dashed border-zinc-400 dark:border-zinc-600 p-4 text-center bg-white dark:bg-zinc-800"
        >
          <input {...getInputProps()} />
          {isDragActive ? <p>Drop the image here…</p> : <p>Drag & drop an image here, or click to select</p>}
        </div>
        {form.watch('thumbnail') && (
          <img
            src={form.watch('thumbnail')!}
            alt="preview"
            className="mt-3 h-28 w-28 object-cover rounded-md border border-zinc-300 dark:border-zinc-700"
          />
        )}
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-blue-600 text-white px-4 py-2 disabled:opacity-50"
        >
          {courseId ? (submitting ? 'Saving…' : 'Save') : submitting ? 'Creating…' : 'Create'}
        </button>
        <button type="button" onClick={() => navigate(-1)} className="rounded-md border px-4 py-2">
          Cancel
        </button>
      </div>
    </form>
  );
}
