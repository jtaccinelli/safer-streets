import create, { StateCreator } from "zustand";
import { persist } from "zustand/middleware";

import { Report } from "~/types/db";
import { FormValues } from "~/types/form";

import fetchReports from "~/lib/fetch-reports";
import uploadFile from "~/lib/upload-file";
import uploadReport from "~/lib/upload-report";
import parseReportsAsGeoJSON from "~/lib/parse-reports-as-geojson";

interface State {
  reports: Report[];
  geojson: string;
  lastSynced: string;
  isSyncing: boolean;
  isUploading: boolean;
}

interface Actions {
  uploadReport: (values: FormValues) => Promise<void>;
  syncReports: () => Promise<void>;
  parseReports: () => void;
}

interface Store extends Actions, State {}

const initialState: State = {
  reports: [],
  geojson: "",
  lastSynced: new Date(0).toISOString(),
  isSyncing: false,
  isUploading: false,
};

const store: StateCreator<Store, [["zustand/persist", unknown]]> = (
  set,
  get
) => ({
  ...initialState,
  uploadReport: async (values: FormValues) => {
    set({ isUploading: true });
    const { syncReports } = get();
    const imageUrl = await uploadFile(values.image);
    await uploadReport(values, imageUrl);
    set({ isUploading: false });
    await syncReports();
  },
  syncReports: async () => {
    const { reports: currentReports, lastSynced, parseReports } = get();
    set({ isSyncing: true });

    const freshReports = await fetchReports({
      lastSynced: new Date(lastSynced).toISOString(),
    });

    const unchangedReports = currentReports.filter((current) => {
      return !freshReports.some((fresh) => fresh.id === current.id);
    });

    const updatedLastSynced = freshReports.reduce((date, { updated_at }) => {
      if (!updated_at) return date;
      return Math.max(new Date(updated_at).getTime(), date);
    }, 0);

    set({
      reports: [...unchangedReports, ...freshReports],
      isSyncing: false,
      lastSynced: new Date(updatedLastSynced).toISOString(),
    });

    parseReports();
  },
  parseReports: () => {
    const { reports } = get();
    set({
      geojson: parseReportsAsGeoJSON(reports),
    });
  },
});

export const useReportStore = create<Store>()(
  persist(store, {
    name: "reports",
  })
);
