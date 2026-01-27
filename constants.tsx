import React from 'react';
import {
  FileText,
  FileSpreadsheet,
  FileImage,
  Folder,
  File,
  Cake,
  PartyPopper,
  Briefcase,
  AlertCircle
} from 'lucide-react';
import { DocType, EventType } from './types';

export const DOC_ICONS: Record<DocType, React.ReactNode> = {
  [DocType.DOC]: <FileText className="w-5 h-5 text-blue-400" />,
  [DocType.SHEET]: <FileSpreadsheet className="w-5 h-5 text-green-400" />,
  [DocType.SLIDE]: <FileImage className="w-5 h-5 text-orange-400" />,
  [DocType.PDF]: <File className="w-5 h-5 text-red-400" />,
  [DocType.FOLDER]: <Folder className="w-5 h-5 text-slate-400" />,
};

export const EVENT_ICONS: Record<EventType, React.ReactNode> = {
  [EventType.BIRTHDAY]: <Cake className="w-4 h-4 text-pink-400" />,
  [EventType.CELEBRATION]: <PartyPopper className="w-4 h-4 text-yellow-400" />,
  [EventType.HR]: <Briefcase className="w-4 h-4 text-blue-400" />,
  [EventType.OPS]: <AlertCircle className="w-4 h-4 text-slate-400" />,
};

// Using white alpha backgrounds for dark mode elegance
export const EVENT_COLORS: Record<EventType, string> = {
  [EventType.BIRTHDAY]: 'bg-pink-50 border-pink-200 text-pink-600',
  [EventType.CELEBRATION]: 'bg-yellow-50 border-yellow-200 text-yellow-600',
  [EventType.HR]: 'bg-blue-50 border-blue-200 text-blue-600',
  [EventType.OPS]: 'bg-slate-100 border-slate-200 text-slate-600',
};