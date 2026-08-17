export type PushActionResponse =
  | { success: true }
  | { success: false; error: string };
