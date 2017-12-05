# zafiro-validators

[![Join the chat at https://gitter.im/inversify/InversifyJS](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/inversify/InversifyJS?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![npm version](https://badge.fury.io/js/zafiro-validators.svg)](http://badge.fury.io/js/zafiro-validators)
[![Build Status](https://travis-ci.org/ZafiroJS/zafiro-validators.svg?branch=master)](https://travis-ci.org/ZafiroJS/zafiro-validators)
[![Dependencies](https://david-dm.org/ZafiroJS/zafiro-validators.svg)](https://david-dm.org/ZafiroJS/zafiro-validators#info=dependencies)
[![img](https://david-dm.org/ZafiroJS/zafiro-validators/dev-status.svg)](https://david-dm.org/ZafiroJS/zafiro-validators/#info=devDependencies)
[![Known Vulnerabilities](https://snyk.io/test/github/ZafiroJS/zafiro-validators/badge.svg)](https://snyk.io/test/github/ZafiroJS/zafiro-validators)
[![Twitter Follow](https://img.shields.io/twitter/follow/InversifyJS.svg?style=flat&maxAge=86400)](https://twitter.com/inversifyjs)

Decorator based interface for [Joi](https://www.npmjs.com/package/joi).

> :warning: This library is part of the [Zafiro]() ecosystem but it is **standalone and can be used on its own**.

## Installation

```sh
npm install zafiro-validators reflect-metadata
```

> :warning: **The `reflect-metadata` polyfill should be imported only once in your entire application** because the Reflect object is mean to be a global singleton. More details about this can be found [here](https://github.com/inversify/InversifyJS/issues/262#issuecomment-227593844).

## The basics

First you need to declare an entity:

```ts
import { mustBe, a } from "zafiro-validators";

export class User {
    @mustBe(a.string().alphanum().min(3).max(30).required())
    public username: string;
    @mustBe(a.string().regex(/^[a-zA-Z0-9]{3,30}$/))
    public password: string;
    @mustBe([a.string(), a.number()])
    public accessToken: string|number;
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
        this.accessToken = accessToken;
        this.birthyear = birthyear;
        this.email = email;
    }
}
```

Then you can validate the entity instances:

```ts
import { validate } from "zafiro-validators";
import { expect } from "chai";
import {  User } from "./entities/user";

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

You can also validate object literals (as opposed to instances of a class) but you will need to pass the expected schema to `validate `as `validate(literal, Class)`:

```ts
import { validate } from "zafiro-validators";
import { expect } from "chai";
import {  User } from "./entities/user";

const user2 = {
    username: "root",
    password: "secret$",
    accessToken: "token",
    birthyear: 1989,
    email: "test@test.com"
};

const result2 = validate(user2, User);
expect(result2.error.message).to.eql(
    `child "password" fails because ["password" with value "secret$" ` +
    `fails to match the required pattern: /^[a-zA-Z0-9]{3,30}$/]`
);
```

You can learn more about the Joi API [here](https://github.com/hapijs/joi/blob/1075980c3e5331b951156635994cc616673935b2/API.md).
