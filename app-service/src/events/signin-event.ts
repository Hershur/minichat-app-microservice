export class SignInEvent {
  constructor(
    public readonly email: string,
    public readonly password: string,
  ) {}
}
