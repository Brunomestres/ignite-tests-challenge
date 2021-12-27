import { hash } from "bcryptjs";
import authConfig from "../../../../config/auth";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let userRepository: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;

describe("Authenticate user", () => {
  beforeEach(() => {
    authConfig.jwt.secret = "8177460a5d7a89809fedc873595826c5";
    userRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(userRepository);
  });

  it("should be able to authenticate an user", async () => {
    const user: ICreateUserDTO = {
      email: "user@test.com",
      password: await hash("1234", 8),
      name: "User Test",
    };

    const response = await userRepository.create(user);

    const result = await authenticateUserUseCase.execute({
      email: response.email,
      password: "1234",
    });
    expect(result).toHaveProperty("token");
    expect(result).toHaveProperty("user");
  });

  it("Should not be able to authenticate an unexistent user", async () => {
    const user: ICreateUserDTO = {
      email: "user@test.com",
      password: await hash("1234", 8),
      name: "User Test",
    };
    await expect(
      authenticateUserUseCase.execute({
        email: user.email,
        password: "12345",
      })
    ).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("Should not be able to authenticate an user with an incorrect password", async () => {
    const user: ICreateUserDTO = {
      email: "user@test.com",
      password: await hash("1234", 8),
      name: "User Test",
    };

    const response = await userRepository.create(user);

    await expect(
      authenticateUserUseCase.execute({
        email: response.email,
        password: "1234555",
      })
    ).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});
