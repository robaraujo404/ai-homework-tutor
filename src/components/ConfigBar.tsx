"use client";

import { useTranslations } from "next-intl";

const GRADES = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

const SUBJECTS = [
  { value: "matematica", icon: "📐" },
  { value: "portugues", icon: "📖" },
  { value: "ciencias", icon: "🌿" },
  { value: "historia", icon: "📜" },
  { value: "geografia", icon: "🗺️" },
  { value: "ingles", icon: "🌎" },
  { value: "outro", icon: "✏️" },
];

interface ConfigBarProps {
  selectedGrade: string | null;
  onGradeChange: (grade: string | null) => void;
  selectedSubject: string | null;
  onSubjectChange: (subject: string | null) => void;
  isOpen: boolean;
}

export default function ConfigBar({
  selectedGrade,
  onGradeChange,
  selectedSubject,
  onSubjectChange,
  isOpen,
}: ConfigBarProps) {
  const t = useTranslations();

  return (
    <div
      className={`border-b border-gray-200 bg-white transition-all duration-200 overflow-hidden ${
        isOpen ? "max-h-64 py-4" : "max-h-0 sm:max-h-64 sm:py-4"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-4">
        {/* Grades */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {t("chat.grade_label")}
          </span>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {GRADES.map((grade) => (
              <button
                key={grade}
                onClick={() => onGradeChange(selectedGrade === grade ? null : grade)}
                className={`flex-none rounded-full px-4 py-1.5 text-sm transition-colors ${
                  selectedGrade === grade
                    ? "bg-blue-500 text-white"
                    : "border border-gray-300 bg-white text-gray-600 hover:border-gray-400"
                }`}
              >
                {t(`grades.${grade}`)}
              </button>
            ))}
          </div>
        </div>

        {/* Subjects */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {t("chat.subject_label")}
          </span>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {SUBJECTS.map((subject) => (
              <button
                key={subject.value}
                onClick={() =>
                  onSubjectChange(selectedSubject === subject.value ? null : subject.value)
                }
                className={`flex-none flex items-center gap-2 rounded-full px-4 py-1.5 text-sm transition-colors ${
                  selectedSubject === subject.value
                    ? "bg-blue-500 text-white"
                    : "border border-gray-300 bg-white text-gray-600 hover:border-gray-400"
                }`}
              >
                <span>{subject.icon}</span>
                {t(`subjects.${subject.value}`)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
