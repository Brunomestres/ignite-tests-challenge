import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { GetBalanceUseCase } from "../getBalance/GetBalanceUseCase";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { CreateStatementError } from "./CreateStatementError";

let statementsRepository: IStatementsRepository;
let userRepository: IUsersRepository;
let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;
let getBalanceUseCase: GetBalanceUseCase;
enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}

describe("Create Statement", () => {
  beforeEach(() => {
    statementsRepository = new InMemoryStatementsRepository();
    userRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(userRepository);
    createStatementUseCase = new CreateStatementUseCase(
      userRepository,
      statementsRepository
    );
    getBalanceUseCase = new GetBalanceUseCase(
      statementsRepository,
      userRepository
    );
  });
  it("Should be able to make a deposit in an user account", async () => {
    const user = await createUserUseCase.execute({
      name: "John",
      email: "john@test.com",
      password: "1234",
    });

    const user_id = user.id as string;

    const statement = await createStatementUseCase.execute({
      user_id,
      amount: 100,
      description: "Deposit amount",
      type: "deposit" as OperationType,
    });

    expect(statement).toHaveProperty("id");
  });

  it("Should be able to withdraw credits from an user account", async () => {
    const user = await createUserUseCase.execute({
      name: "John",
      email: "john@test.com",
      password: "1234",
    });

    const user_id = user.id as string;

    const deposit = await createStatementUseCase.execute({
      user_id,
      amount: 100,
      description: "John@",
      type: "deposit" as OperationType,
    });

    const withdraw = await createStatementUseCase.execute({
      user_id,
      amount: 100,
      description: "John@",
      type: "withdraw" as OperationType,
    });

    const balance = await getBalanceUseCase.execute({ user_id });

    expect(balance).toHaveProperty("balance", 0);
  });

  it("Should not be able to withdraw credits from an unexistent user account", async () => {
    expect(async () => {
      const user_id = "unexistent";

      await createStatementUseCase.execute({
        user_id,
        type: "withdraw" as OperationType,
        amount: 100,
        description: "unexistent user",
      });
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });
});
