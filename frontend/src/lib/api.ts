import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
});

export interface LearningSignal {
  type: string;
  payload: Record<string, unknown>;
}

export interface PersonaUpdateRequest {
  user_id: string;
  signals: LearningSignal[];
  feedback?: string;
}

export const fetchPersona = async (userId: string) => {
  const res = await api.get(`/persona/${userId}`);
  return res.data;
};

export const postLearn = async (payload: PersonaUpdateRequest) => {
  const res = await api.post("/persona/learn", payload);
  return res.data;
};

