import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import useAuthStore from "@/store/authStore";

interface QuestionForm {
  _id?: string;
  text: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: "A" | "B" | "C" | "D";
  category: string;
  difficulty: "Basic" | "Core" | "Advanced";
  cpdTag: boolean;
}

interface Exam {
  _id: string;
  title: string;
}

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/plab`;
const EXAM_URL = `${import.meta.env.VITE_API_BASE_URL}/exam/exams`;

export default function AdminPLAB() {
  const [questions, setQuestions] = useState<QuestionForm[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [selectedExamId, setSelectedExamId] = useState<string>("");

  const [form, setForm] = useState<QuestionForm>({
    text: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correctAnswer: "A",
    category: "Emergency",
    difficulty: "Basic",
    cpdTag: false,
  });

  const { token } = useAuthStore();
  const axiosConfig = { headers: { Authorization: `Bearer ${token}` } };

  // Fetch exams from backend
  const fetchExams = async () => {
    try {
      const res = await axios.get(EXAM_URL, axiosConfig);
      setExams(res.data.data || []);
      if (res.data.data.length > 0) setSelectedExamId(res.data.data[0]._id);
    } catch (err) {
      console.error(err);
      toast("Failed to fetch exams");
    }
  };

  // Fetch questions for selected exam
  const fetchQuestions = async () => {
    if (!selectedExamId) return;
    try {
      const res = await axios.get(
        `${API_URL}/questions?examId=${selectedExamId}`,
        axiosConfig,
      );
      setQuestions(res.data.questions);
    } catch (err) {
      console.error(err);
      toast("Failed to fetch questions");
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  useEffect(() => {
    fetchQuestions();
  }, [selectedExamId]);

  // Handle form changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    const checked =
      e.target instanceof HTMLInputElement && e.target.type === "checkbox"
        ? e.target.checked
        : undefined;

    setForm((prev) => ({
      ...prev,
      [name]: checked !== undefined ? checked : value,
    }));
  };

  // Add or update question
  const handleSubmit = async () => {
    if (!selectedExamId) {
      toast("Please select an exam first");
      return;
    }
    try {
      if (form._id) {
        await axios.put(
          `${API_URL}/admin/questions/${form._id}`,
          { ...form, examId: selectedExamId },
          axiosConfig,
        );
        toast("Question updated successfully");
      } else {
        await axios.post(
          `${API_URL}/admin/questions`,
          { questions: [{ ...form, examId: selectedExamId }] },
          axiosConfig,
        );
        toast("Question added successfully");
      }
      setForm({
        text: "",
        optionA: "",
        optionB: "",
        optionC: "",
        optionD: "",
        correctAnswer: "A",
        category: "Emergency",
        difficulty: "Basic",
        cpdTag: false,
      });
      fetchQuestions();
    } catch (err) {
      console.error(err);
      toast("Failed to submit question");
    }
  };

  // Load question data into form for editing
  const handleEdit = (q: QuestionForm) => {
    setForm(q);
  };

  // Delete a question
  const handleDelete = async (_id: string) => {
    if (!window.confirm("Are you sure you want to delete this question?"))
      return;
    try {
      await axios.delete(`${API_URL}/admin/questions/${_id}`, axiosConfig);
      toast("Question deleted successfully");
      fetchQuestions();
    } catch (err) {
      console.error(err);
      toast("Failed to delete question");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">PLAB Admin Dashboard</h1>

      {/* Exam Selection */}
      <div className="mb-4 flex items-center gap-2">
        <label className="font-semibold">Select Exam:</label>
        <select
          value={selectedExamId}
          onChange={(e) => setSelectedExamId(e.target.value)}
          className="rounded border p-1"
        >
          {exams.map((exam) => (
            <option key={exam._id} value={exam._id}>
              {exam.title}
            </option>
          ))}
        </select>
        <Button onClick={fetchQuestions}>Load Questions</Button>
      </div>

      {/* Add/Edit Question Form */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>
            {form._id ? "Edit Question" : "Add New Question"}
          </CardTitle>
          <CardDescription>Fill out the fields and submit.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            placeholder="Question text"
            name="text"
            value={form.text}
            onChange={handleChange}
          />
          <Input
            placeholder="Option A"
            name="optionA"
            value={form.optionA}
            onChange={handleChange}
          />
          <Input
            placeholder="Option B"
            name="optionB"
            value={form.optionB}
            onChange={handleChange}
          />
          <Input
            placeholder="Option C"
            name="optionC"
            value={form.optionC}
            onChange={handleChange}
          />
          <Input
            placeholder="Option D"
            name="optionD"
            value={form.optionD}
            onChange={handleChange}
          />

          <div className="flex items-center gap-3">
            <select
              name="correctAnswer"
              value={form.correctAnswer}
              onChange={handleChange}
            >
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
            </select>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
            >
              <option value="Emergency">Emergency</option>
              <option value="Surgery">Surgery</option>
              <option value="Medicine">Medicine</option>
            </select>
            <select
              name="difficulty"
              value={form.difficulty}
              onChange={handleChange}
            >
              <option value="Basic">Basic</option>
              <option value="Core">Core</option>
              <option value="Advanced">Advanced</option>
            </select>
            <label className="flex items-center gap-1">
              CPD Tag
              <input
                type="checkbox"
                name="cpdTag"
                checked={form.cpdTag}
                onChange={handleChange}
              />
            </label>
          </div>

          <Button onClick={handleSubmit}>
            {form._id ? "Update Question" : "Add Question"}
          </Button>
        </CardContent>
      </Card>

      {/* Existing Questions List */}
      <h2 className="mb-2 text-xl font-semibold">Existing Questions</h2>
      {questions.map((q) => (
        <Card key={q._id} className="mb-2">
          <CardContent className="flex flex-col gap-2">
            <p>{q.text}</p>
            <div className="text-muted-foreground flex gap-2 text-sm">
              <span>A: {q.optionA}</span>
              <span>B: {q.optionB}</span>
              <span>C: {q.optionC}</span>
              <span>D: {q.optionD}</span>
            </div>
            <p>Correct: {q.correctAnswer}</p>
            <p>
              Category: {q.category} | Difficulty: {q.difficulty} | CPD:{" "}
              {q.cpdTag ? "Yes" : "No"}
            </p>
            <div className="mt-2 flex gap-2">
              <Button size="sm" variant="outline" onClick={() => handleEdit(q)}>
                Edit
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleDelete(q._id!)}
              >
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
