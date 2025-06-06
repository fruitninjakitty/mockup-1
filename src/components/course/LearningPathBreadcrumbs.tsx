import React from 'react';
import { ModuleData } from './LearningMapVisualization';

interface LearningPath {
  id: string;
  name: string;
  modules: string[];
}

interface LearningPathBreadcrumbsProps {
  selectedPath: LearningPath | null;
  currentModuleInPath: ModuleData | null;
  allModules: ModuleData[];
  onModuleClick: (moduleId: string) => void; // Function to center map on module
}

export function LearningPathBreadcrumbs({
  selectedPath,
  currentModuleInPath,
  allModules,
  onModuleClick,
}: LearningPathBreadcrumbsProps) {
  if (!selectedPath) {
    return null;
  }

  return (
    <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-300">
      <span>Path:</span>
      {selectedPath.modules.map((moduleId, index) => {
        const module = allModules.find((m) => m.id === moduleId);
        if (!module) return null; // Should not happen with consistent data

        const isCurrent = module.id === currentModuleInPath?.id;

        return (
          <React.Fragment key={module.id}>
            <span
              className={`cursor-pointer ${isCurrent ? 'font-bold text-blue-600 dark:text-blue-400' : 'hover:underline'}`}
              onClick={() => onModuleClick(module.id)}
            >
              {module.name}
            </span>
            {index < selectedPath.modules.length - 1 && <span>/</span>}
          </React.Fragment>
        );
      })}
    </div>
  );
} 