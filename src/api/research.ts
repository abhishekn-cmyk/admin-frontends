import axiosInstance from "@/lib/axiosInstance";
import {
  IPublication,
  IFocusArea,
  IPartnership,
  IParticipation,
  IProposal,
} from "@/types/research";

// CREATE
export const createPublication = (data: IPublication) =>
  axiosInstance.post("/research/publications", data);

export const createFocusArea = (data: IFocusArea) =>
  axiosInstance.post("/research/focus-areas", data);

export const createPartnership = (data: IPartnership) =>
  axiosInstance.post("/research/partnerships", data);

export const createParticipation = (data: IParticipation) =>
  axiosInstance.post("/research/participations", data);

export const createProposal = (data: IProposal) =>
  axiosInstance.post("/research/proposals", data);

// FETCH COUNTS
export const fetchResearchCounts = async () => {
  const [pubRes, focusRes, partRes, participationRes, proposalRes] =
    await Promise.all([
      axiosInstance.get("/research/publications"),
      axiosInstance.get("/research/focus-areas"),
      axiosInstance.get("/research/partnerships"),
      axiosInstance.get("/research/participations"),
      axiosInstance.get("/research/proposals"),
    ]);

  return {
    publications: pubRes.data.data.length,
    focusAreas: focusRes.data.data.length,
    partnerships: partRes.data.data.length,
    participations: participationRes.data.data.length,
    proposals: proposalRes.data.data.length,
  };
};
