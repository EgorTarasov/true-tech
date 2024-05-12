import api from "api/utils/api";

export namespace DetectionEndpoint {
  export const execute = (query: string, sessionId: string, names: string[]) => {
    return api.post<{
      content: Record<string, string>;
      detectionStatus: number;
      err: string;
      queryId: number;
      sessionId: string;
    }>("/detection/execute", {
      query,
      sessionId,
      names
    });
  };
}
