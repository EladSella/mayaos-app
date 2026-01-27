import React from 'react';
import { SearchResult } from '../types';
import { DOC_ICONS } from '../constants';
import { ExternalLink } from 'lucide-react';

interface Props {
  result: SearchResult;
}

export const SearchResultItem: React.FC<Props> = ({ result }) => {
  return (
    <a
      href={result.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-white rounded-xl p-3 sm:p-4 border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-200 mb-3 cursor-pointer active:scale-[0.99] active:bg-slate-50"
    >
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="mt-1 p-1.5 sm:p-2 bg-slate-50 rounded-lg border border-slate-100 group-hover:border-slate-200 transition-all shrink-0">
          {DOC_ICONS[result.type]}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-sm sm:text-base font-medium text-slate-900 truncate group-hover:text-blue-600 transition-colors">
              {result.title}
            </h4>
            <span className="text-xs text-slate-500 whitespace-nowrap hidden sm:block">
              {result.updatedAt}
            </span>
          </div>

          <div
            className="text-xs sm:text-sm text-slate-500 mt-1 line-clamp-2 [&>span]:bg-yellow-100 [&>span]:text-yellow-800 [&>span]:px-1 [&>span]:rounded"
            dangerouslySetInnerHTML={{ __html: result.snippet }}
          />

          <div className="flex items-center gap-2 mt-2 sm:mt-3 text-xs text-slate-400 flex-wrap">
            <span className="font-medium bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded text-slate-500 truncate max-w-[120px] sm:max-w-[150px]">
              {result.location}
            </span>
            <span>•</span>
            <span className="truncate max-w-[100px] sm:max-w-none">{result.owner}</span>
            <ExternalLink className="w-3 h-3 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity ml-auto text-slate-400" />
          </div>
        </div>
      </div>
    </a>
  );
};