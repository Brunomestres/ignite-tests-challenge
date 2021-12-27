import { hash } from "bcryptjs";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let userRepository: InMemoryUsersRepository;

let createUserUseCase: CreateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;
describe("Show Profile", () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(userRepository);
    showUserProfileUseCase = new ShowUserProfileUseCase(userRepository);
  });

  it("Should be able to return an user profile", async () => {
    const user: ICreateUserDTO = {
      email: "user@test.com",
      password: await hash("1234", 8),
      name: "User Test",
    };

    const response = await createUserUseCase.execute(user);

    const user_id = response.id as string;

    const result = await showUserProfileUseCase.execute(user_id);

    expect(result).toHaveProperty("name");
    expect(result).toHaveProperty("email");
  });

  it("Should not be able to return a non existent user", async () => {
    await expect(showUserProfileUseCase.execute("1234")).rejects.toBeInstanceOf(
      ShowUserProfileError
    );
  });
});
