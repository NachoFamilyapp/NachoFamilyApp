export interface NoodBroadcast {
  message: string;
  sentAt: number;
  targetType: "alle" | "specifiek";
  targetUids: string[];
}
