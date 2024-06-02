import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { DeleteAnswerUseCase } from "./delete-answer";
import { InMemoryAnswerRepository } from "test/repositories/in-memory-answer-repositories";
import { makeAnswer } from "test/factories/make-answer";

let inMemoryAnswerRepository: InMemoryAnswerRepository;
let sut: DeleteAnswerUseCase;

describe("Delete answer", async () => {
  beforeEach(() => {
    inMemoryAnswerRepository = new InMemoryAnswerRepository();
    sut = new DeleteAnswerUseCase(inMemoryAnswerRepository);
  });

  it("should be able to delete a answer", async () => {
    const newAnswer = makeAnswer(
      { authorId: new UniqueEntityID("author1") },
      new UniqueEntityID("answer1")
    );
    inMemoryAnswerRepository.create(newAnswer);

    await sut.handle({ answerId: "answer1", authorId: "author1" });

    expect(inMemoryAnswerRepository.item).toHaveLength(0);
  });
  it("should not be able to delete a answer from another user", async () => {
    const newAnswer = makeAnswer(
      { authorId: new UniqueEntityID("author1") },
      new UniqueEntityID("answer1")
    );
    inMemoryAnswerRepository.create(newAnswer);

    await expect(() => {
      return sut.handle({ answerId: "answer1", authorId: "author2" });
    }).rejects.toBeInstanceOf(Error);
  });
});