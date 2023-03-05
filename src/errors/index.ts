// eslint-disable-next-line max-classes-per-file
export class FullError extends Error {
  code = '000';
  status = 500;
  userId: string;
}

export class InternalError extends FullError {
  constructor() {
    super('InternalError');
    this.message = 'Internal error. Try again later';
    this.name = 'InternalError';
    this.code = '001';
    this.status = 500;
  }
}

export class MissingProcessPlatform extends FullError {
  constructor() {
    super('MissingProcessPlatform');
    this.message = 'process.platform is missing';
    this.name = 'MissingProcessPlatform';
    this.code = '002';
    this.status = 400;
  }
}

export class NotFoundError extends FullError {
  constructor(userId: string) {
    super('NotFoundError');
    this.message = 'Resource not found';
    this.name = 'NotFoundError';
    this.code = '003';
    this.status = 404;
    this.userId = userId;
  }
}

export class WrongType extends FullError {
  constructor(userId: string) {
    super('WrongType');
    this.message = 'Wrong type of data';
    this.name = 'WrongType';
    this.code = '004';
    this.status = 400;
    this.userId = userId;
  }
}

export class Unauthorized extends FullError {
  constructor() {
    super('Unauthorized');
    this.message = 'User not logged in';
    this.name = 'Unauthorized';
    this.code = '005';
    this.status = 401;
  }
}

export class InvalidType extends FullError {
  constructor(userId: string, target: string) {
    super('InvalidType');
    this.message = `Invalid type. Element ${target} has wrong type`;
    this.name = 'InvalidType';
    this.code = '006';
    this.status = 400;
    this.userId = userId;
  }
}

export class InvalidMongooseType extends FullError {
  constructor(userId: string, target: string) {
    super('InvalidMongooseType');
    this.message = `Invalid type. Element ${target} is not valid mongoDB id`;
    this.name = 'InvalidMongooseType';
    this.code = '007';
    this.status = 400;
    this.userId = userId;
  }
}

export class MissingData extends FullError {
  constructor(userId: string, data: string) {
    super('MissingData');
    this.message = `Value: ${data} is missing`;
    this.name = 'MissingData';
    this.code = '008';
    this.status = 400;
    this.userId = userId;
  }
}

export class InvalidSize extends FullError {
  constructor(userId: string, message: string) {
    super('InvalidSize');
    this.message = message;
    this.name = 'InvalidSize';
    this.code = '009';
    this.status = 400;
    this.userId = userId;
  }
}

export class MissingMessage extends FullError {
  constructor(userId: string) {
    super('InvalidSize');
    this.message = 'Selected message does not exist';
    this.name = 'InvalidSize';
    this.code = '010';
    this.status = 400;
    this.userId = userId;
  }
}
