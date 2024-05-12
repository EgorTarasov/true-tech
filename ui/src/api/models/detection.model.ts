export namespace DetectionDto {
  export interface Item {
    sessionId: string;
    queryId: number;
    content: Record<string, string>;
    detectionStatus: number;
    err: string;
  }
}
