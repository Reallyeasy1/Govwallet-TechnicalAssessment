export class TeamNameNotFound extends Error {
  constructor() {
    super("Team name not found");
    this.name = "TeamNameNotFound";
  }
}
