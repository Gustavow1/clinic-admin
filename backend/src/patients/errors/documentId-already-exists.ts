import { BaseError } from "src/errors/base-error";

type DocumentId = {
  number: string;
  type: string;
}

export class DocumentIdAlreadyExistsError extends Error implements BaseError {
  constructor(documentId: DocumentId[]) {
    super(`The documentId ${documentId} already exists.`);
    this.name = "DocumentIdAlreadyExistsError";
  }
}