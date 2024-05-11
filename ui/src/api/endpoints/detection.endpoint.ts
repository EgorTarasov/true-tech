import api from "api/utils/api";

export namespace DetectionEndpoint {
  export const execute = (query: string, sessionId: string) => {
    return api.post("/detection/execute", {
      query,
      sessionId
    });
  };
}
