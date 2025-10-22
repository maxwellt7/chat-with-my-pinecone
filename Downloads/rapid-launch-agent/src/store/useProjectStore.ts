import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Project, OfferData, AvatarData, CompetitorData, ManifoldData, LaunchDocData } from '../types';

interface ProjectStore {
  currentProject: Project | null;
  projects: Project[];
  
  // Actions
  createProject: (name: string) => void;
  loadProject: (id: string) => void;
  updateOffer: (data: OfferData) => void;
  updateAvatar: (data: AvatarData) => void;
  updateCompetitors: (data: CompetitorData) => void;
  updateManifold: (data: ManifoldData) => void;
  updateLaunchDoc: (data: LaunchDocData) => void;
  setCurrentStep: (step: number) => void;
  deleteProject: (id: string) => void;
}

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set, get) => ({
      currentProject: null,
      projects: [],

      createProject: (name: string) => {
        const newProject: Project = {
          id: `proj_${Date.now()}`,
          name,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          currentStep: 1,
          offer: null,
          avatar: null,
          competitors: null,
          manifold: null,
          launchDoc: null,
        };

        set((state) => ({
          projects: [...state.projects, newProject],
          currentProject: newProject,
        }));
      },

      loadProject: (id: string) => {
        const project = get().projects.find((p) => p.id === id);
        if (project) {
          set({ currentProject: project });
        }
      },

      updateOffer: (data: OfferData) => {
        set((state) => {
          if (!state.currentProject) return state;

          const updatedProject = {
            ...state.currentProject,
            offer: data,
            updatedAt: new Date().toISOString(),
          };

          return {
            currentProject: updatedProject,
            projects: state.projects.map((p) =>
              p.id === updatedProject.id ? updatedProject : p
            ),
          };
        });
      },

      updateAvatar: (data: AvatarData) => {
        set((state) => {
          if (!state.currentProject) return state;

          const updatedProject = {
            ...state.currentProject,
            avatar: data,
            updatedAt: new Date().toISOString(),
          };

          return {
            currentProject: updatedProject,
            projects: state.projects.map((p) =>
              p.id === updatedProject.id ? updatedProject : p
            ),
          };
        });
      },

      updateCompetitors: (data: CompetitorData) => {
        set((state) => {
          if (!state.currentProject) return state;

          const updatedProject = {
            ...state.currentProject,
            competitors: data,
            updatedAt: new Date().toISOString(),
          };

          return {
            currentProject: updatedProject,
            projects: state.projects.map((p) =>
              p.id === updatedProject.id ? updatedProject : p
            ),
          };
        });
      },

      updateManifold: (data: ManifoldData) => {
        set((state) => {
          if (!state.currentProject) return state;

          const updatedProject = {
            ...state.currentProject,
            manifold: data,
            updatedAt: new Date().toISOString(),
          };

          return {
            currentProject: updatedProject,
            projects: state.projects.map((p) =>
              p.id === updatedProject.id ? updatedProject : p
            ),
          };
        });
      },

      updateLaunchDoc: (data: LaunchDocData) => {
        set((state) => {
          if (!state.currentProject) return state;

          const updatedProject = {
            ...state.currentProject,
            launchDoc: data,
            updatedAt: new Date().toISOString(),
          };

          return {
            currentProject: updatedProject,
            projects: state.projects.map((p) =>
              p.id === updatedProject.id ? updatedProject : p
            ),
          };
        });
      },

      setCurrentStep: (step: number) => {
        set((state) => {
          if (!state.currentProject) return state;

          const updatedProject = {
            ...state.currentProject,
            currentStep: step,
            updatedAt: new Date().toISOString(),
          };

          return {
            currentProject: updatedProject,
            projects: state.projects.map((p) =>
              p.id === updatedProject.id ? updatedProject : p
            ),
          };
        });
      },

      deleteProject: (id: string) => {
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
          currentProject: state.currentProject?.id === id ? null : state.currentProject,
        }));
      },
    }),
    {
      name: 'rapid-launch-storage',
    }
  )
);

