export interface AdminCommandResult {
  handled: boolean;
}

export type AdminCommandHandler = (
  command: string | undefined,
  args: string[]
) => Promise<AdminCommandResult>;

export const adminCommandNotHandled = { handled: false } as const;

export function adminCommandHandled(): AdminCommandResult {
  return { handled: true };
}
