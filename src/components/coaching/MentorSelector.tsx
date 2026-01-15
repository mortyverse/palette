'use client';

import React from 'react';

export interface Mentor {
  id: string;
  name: string;
  title: string;
  bio: string;
  avatar: string;
  specialties: string[];
}

interface MentorSelectorProps {
  mentors: Mentor[];
  onSelect: (mentorId: string) => void;
  selectedMentorId?: string;
}

export function MentorSelector({
  mentors,
  onSelect,
  selectedMentorId,
}: MentorSelectorProps) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold mb-4">멘토 선택</h2>
        <p className="text-sm text-gray-600 mb-6">
          피드백을 받을 멘토를 선택하세요
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mentors.map((mentor) => (
          <button
            key={mentor.id}
            onClick={() => onSelect(mentor.id)}
            className={`text-left transition-all p-4 rounded-lg border-2 ${
              selectedMentorId === mentor.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:shadow-lg'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-base">{mentor.name}</h3>
                <p className="text-xs text-gray-600">{mentor.title}</p>
              </div>
              {selectedMentorId === mentor.id && (
                <div className="w-5 h-5 bg-blue-500 rounded-full" />
              )}
            </div>
            <p className="text-sm text-gray-700 mb-3">{mentor.bio}</p>
            <div className="flex flex-wrap gap-2">
              {mentor.specialties.map((specialty) => (
                <span
                  key={specialty}
                  className="px-2 py-1 bg-gray-100 text-xs rounded text-gray-700"
                >
                  {specialty}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
