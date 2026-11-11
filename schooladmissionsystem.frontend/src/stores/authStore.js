import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  studentId: localStorage.getItem('studentId') || null,
  setStudentId: (id) => {
    localStorage.setItem('studentId', id);
    set({ studentId: id });
  },
  clearStudentId: () => {
    localStorage.removeItem('studentId');
    set({ studentId: null });
  },
}));
