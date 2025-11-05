"use client";

import { useGetCoursesOfLevelMutation } from '@/features/manager/hook/coursesHooks/courseHooks';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Pencil, Trash2, Search, BookOpen, Layers, ChevronRight, FolderOpen, FileText, HelpCircle } from 'lucide-react';

interface Course {
  courseId: string;
  title: string;
  type: string;
  numberOfChapter: number;
  orderIndex: number;
  level: string;
  price: number;
  chapters?: Chapter[];
}

interface Chapter {
  chapterId: string;
  title: string;
  description: string;
  orderIndex: number;
  exercises?: Exercise[];
}

interface Exercise {
  exerciseId: string;
  title: string;
  description: string;
  orderIndex: number;
  questions?: Question[];
}

interface Question {
  questionId: string;
  content: string;
  type: string;
  orderIndex: number;
}

const LevelA1 = () => {
  const { data: response, isLoading, isError } = useGetCoursesOfLevelMutation('A1');
  const coursesOfLevelA1 = response?.data || [];

  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [deletingCourse, setDeletingCourse] = useState<Course | null>(null);

  // View states for hierarchical navigation
  const [viewMode, setViewMode] = useState<'course' | 'chapter' | 'exercise' | 'question'>('course');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  const [form, setForm] = useState({
    title: '',
    type: '',
    numberOfChapter: 0,
    orderIndex: 0,
    price: 0,
  });

  // Filter courses based on search
  const filteredCourses = coursesOfLevelA1.filter((course: Course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = () => {
    setEditingCourse(null);
    setForm({
      title: '',
      type: '',
      numberOfChapter: 0,
      orderIndex: 0,
      price: 0,
    });
    setShowModal(true);
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setForm({
      title: course.title,
      type: course.type,
      numberOfChapter: course.numberOfChapter,
      orderIndex: course.orderIndex,
      price: course.price,
    });
    setShowModal(true);
  };

  const handleDelete = (course: Course) => {
    setDeletingCourse(course);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    // TODO: Implement delete API call
    console.log('Deleting course:', deletingCourse);
    setShowDeleteDialog(false);
    setDeletingCourse(null);
  };

  const handleSave = () => {
    if (editingCourse) {
      // TODO: Implement update API call
      console.log('Updating course:', { ...editingCourse, ...form });
    } else {
      // TODO: Implement create API call
      console.log('Creating course:', { ...form, level: 'A1' });
    }
    setShowModal(false);
  };

  const handleViewChapters = (course: Course) => {
    setSelectedCourse(course);
    setViewMode('chapter');
    // TODO: Fetch chapters for this course
  };

  const handleViewExercises = (chapter: Chapter) => {
    setSelectedChapter(chapter);
    setViewMode('exercise');
    // TODO: Fetch exercises for this chapter
  };

  const handleViewQuestions = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setViewMode('question');
    // TODO: Fetch questions for this exercise
  };

  const handleBackToCourses = () => {
    setViewMode('course');
    setSelectedCourse(null);
    setSelectedChapter(null);
    setSelectedExercise(null);
  };

  const handleBackToChapters = () => {
    setViewMode('chapter');
    setSelectedChapter(null);
    setSelectedExercise(null);
  };

  const handleBackToExercises = () => {
    setViewMode('exercise');
    setSelectedExercise(null);
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      {viewMode !== 'course' && (
        <div className="flex items-center space-x-2 text-sm">
          <button
            onClick={handleBackToCourses}
            className="text-blue-600 hover:text-blue-800 hover:underline"
          >
            Courses
          </button>
          {selectedCourse && (
            <>
              <ChevronRight className="h-4 w-4 text-slate-400" />
              <button
                onClick={handleBackToChapters}
                className={`${
                  viewMode === 'chapter'
                    ? 'text-slate-800 font-medium'
                    : 'text-blue-600 hover:text-blue-800 hover:underline'
                }`}
              >
                {selectedCourse.title}
              </button>
            </>
          )}
          {viewMode !== 'chapter' && selectedChapter && (
            <>
              <ChevronRight className="h-4 w-4 text-slate-400" />
              <button
                onClick={handleBackToExercises}
                className={`${
                  viewMode === 'exercise'
                    ? 'text-slate-800 font-medium'
                    : 'text-blue-600 hover:text-blue-800 hover:underline'
                }`}
              >
                {selectedChapter.title}
              </button>
            </>
          )}
          {viewMode === 'question' && selectedExercise && (
            <>
              <ChevronRight className="h-4 w-4 text-slate-400" />
              <span className="text-slate-800 font-medium">
                {selectedExercise.title}
              </span>
            </>
          )}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
            {viewMode === 'course' && <span className="text-white font-bold text-xl">A1</span>}
            {viewMode === 'chapter' && <BookOpen className="h-7 w-7 text-white" />}
            {viewMode === 'exercise' && <FileText className="h-7 w-7 text-white" />}
            {viewMode === 'question' && <HelpCircle className="h-7 w-7 text-white" />}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              {viewMode === 'course' && 'A1 - Beginner Level'}
              {viewMode === 'chapter' && `Chapters - ${selectedCourse?.title}`}
              {viewMode === 'exercise' && `Exercises - ${selectedChapter?.title}`}
              {viewMode === 'question' && `Questions - ${selectedExercise?.title}`}
            </h1>
            <p className="text-slate-600">
              {viewMode === 'course' && 'Manage courses for beginner level students'}
              {viewMode === 'chapter' && `${selectedCourse?.numberOfChapter || 0} chapters in this course`}
              {viewMode === 'exercise' && 'Manage exercises in this chapter'}
              {viewMode === 'question' && 'Manage questions in this exercise'}
            </p>
          </div>
        </div>
        <Button
          onClick={handleCreate}
          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg"
        >
          <Plus className="h-4 w-4 mr-2" />
          {viewMode === 'course' && 'Add New Course'}
          {viewMode === 'chapter' && 'Add New Chapter'}
          {viewMode === 'exercise' && 'Add New Exercise'}
          {viewMode === 'question' && 'Add New Question'}
        </Button>
      </div>

      {/* Search and Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Search courses by title or type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-800">Total Courses</p>
                <p className="text-3xl font-bold text-green-900">
                  {coursesOfLevelA1.length}
                </p>
              </div>
              <BookOpen className="h-10 w-10 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Layers className="h-5 w-5" />
            <span>Course List</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : isError ? (
            <div className="text-center py-12">
              <div className="text-red-500 text-lg font-semibold mb-2">
                Error loading courses
              </div>
              <p className="text-slate-600">Please try again later</p>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <div className="text-slate-500 text-lg font-semibold mb-2">
                No courses found
              </div>
              <p className="text-slate-600 mb-4">
                {searchTerm ? 'Try adjusting your search' : 'Get started by creating your first course'}
              </p>
              {!searchTerm && (
                <Button onClick={handleCreate} variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Course
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-center">Chapters</TableHead>
                  <TableHead className="text-center">Order</TableHead>
                  <TableHead className="text-center">Price</TableHead>
                  <TableHead className="text-center">Level</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCourses.map((course: Course, index: number) => (
                  <TableRow key={course.courseId} className="hover:bg-slate-50">
                    <TableCell className="font-medium text-slate-600">
                      {index + 1}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-slate-800">{course.title}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-normal">
                        {course.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary">{course.numberOfChapter}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {course.orderIndex}
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="font-medium text-green-600">
                        {course.price === 0 ? 'Free' : `$${course.price}`}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className="bg-green-500 hover:bg-green-600">
                        {course.level}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          onClick={() => handleViewChapters(course)}
                        >
                          <FolderOpen className="h-4 w-4 mr-1" />
                          <span className="text-xs">Chapters</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(course)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDelete(course)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingCourse ? 'Edit Course' : 'Create New Course'}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Course Title</label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g., Basic Speaking Practice"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Type</label>
                <Input
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  placeholder="e.g., Speaking, Grammar"
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium">Number of Chapters</label>
                <Input
                  type="number"
                  min="0"
                  value={form.numberOfChapter}
                  onChange={(e) =>
                    setForm({ ...form, numberOfChapter: Number(e.target.value) })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Order Index</label>
                <Input
                  type="number"
                  min="0"
                  value={form.orderIndex}
                  onChange={(e) =>
                    setForm({ ...form, orderIndex: Number(e.target.value) })
                  }
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium">Price ($)</label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(e) =>
                    setForm({ ...form, price: Number(e.target.value) })
                  }
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {editingCourse ? 'Update' : 'Create'} Course
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the course{' '}
              <strong>&quot;{deletingCourse?.title}&quot;</strong>. This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Chapter View - When viewMode === 'chapter' */}
      {viewMode === 'chapter' && selectedCourse && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FolderOpen className="h-5 w-5" />
              <span>Chapters List</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Mock data - replace with actual API call */}
            <div className="text-center py-12">
              <FolderOpen className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <div className="text-slate-500 text-lg font-semibold mb-2">
                No chapters yet
              </div>
              <p className="text-slate-600 mb-4">
                Start by creating your first chapter for this course
              </p>
              <Button onClick={handleCreate} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Create First Chapter
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Exercise View - When viewMode === 'exercise' */}
      {viewMode === 'exercise' && selectedChapter && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Exercises List</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Mock data - replace with actual API call */}
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <div className="text-slate-500 text-lg font-semibold mb-2">
                No exercises yet
              </div>
              <p className="text-slate-600 mb-4">
                Start by creating your first exercise for this chapter
              </p>
              <Button onClick={handleCreate} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Create First Exercise
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Question View - When viewMode === 'question' */}
      {viewMode === 'question' && selectedExercise && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <HelpCircle className="h-5 w-5" />
              <span>Questions List</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Mock data - replace with actual API call */}
            <div className="text-center py-12">
              <HelpCircle className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <div className="text-slate-500 text-lg font-semibold mb-2">
                No questions yet
              </div>
              <p className="text-slate-600 mb-4">
                Start by creating your first question for this exercise
              </p>
              <Button onClick={handleCreate} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Create First Question
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LevelA1;
