import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let userRepository: InMemoryUsersRepository;

describe("Create User", () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(userRepository);
  });

  it("should be able to create an user", async () => {
    const user = await createUserUseCase.execute({
      name: "John",
      email: "John@example.com",
      password: "12345",
    });

    expect(user).toHaveProperty("id");
  });

  it("should not be able to create a new user with existent email", async () => {
    await createUserUseCase.execute({
      name: "John",
      email: "John@example.com",
      password: "12345",
    });

    await expect(
      createUserUseCase.execute({
        name: "John",
        email: "John@example.com",
        password: "12345",
      })
    ).rejects.toBeInstanceOf(CreateUserError);
  });
});
