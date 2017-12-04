# joi-decorators

Decorator based interface for [Joi](https://www.npmjs.com/package/joi).

## Installation

```sh
npm install joi-decorators reflect-metadata
```

## The basics

```ts
import { shouldBe, a, validate } from "joi-decorators";

class User {
    @mustBe(a.string().alphanum().min(3).max(30).required())
    public username: string;
    @mustBe(a.string().regex(/^[a-zA-Z0-9]{3,30}$/))
    public password: string;
    @mustBe([a.string(), a.number()])
    public access_token: string|number;
    @mustBe(a.number().integer().min(1900).max(2013))
    public birthyear: number;
    @mustBe(a.string().email())
    public email: string;
    public constructor(
        username: string,
        password: string,
        access_token: string|number,
        birthyear: number,
        email: string
    ) {
        this.username = username;
        this.password = password;
        this.access_token = access_token;
        this.birthyear = birthyear;
        this.email = email;
    }
}

const validUser = new User(
    "root",
    "secret",
    "token",
    1989,
    "test@test.com"
);

const result1 = validate(validUser);
expect(result1.error).to.eql(null);

const invalidUser1 = new User(
    "root",
    "secret$",
    "token",
    1989,
    "test@test.com"
);

const result2 = validate(invalidUser1);
expect(result2.error.message).to.eql(
    `child "password" fails because ["password" with value "secret$" ` +
    `fails to match the required pattern: /^[a-zA-Z0-9]{3,30}$/]`
);

const invalidUser2 = new User(
    "root",
    "secret",
    "token",
    1989,
    "test@@test.com"
);

const result3 = validate(invalidUser2);
expect(result3.error.message).to.eql(
    `child "email" fails because ["email" must be a valid email]`
);
```
