import { expect } from "chai";
import { mustBe, a, validate } from "../src";
import {
    decoratorIsForPropertiesOnly,
    decoratorCanOnlyBeAppliedOnce,
    noMetadataWasFound
} from "../src/error";

describe("zafiro-validators", () => {

    it("Should throw if @mustBe is applied to a method", () => {

        function shouldThrow() {

            class Person {
                public name: string;
                @mustBe(a.string())
                public sayHello() {
                    return "Hi!";
                }
            }

        }

        expect(shouldThrow).to.throw(
            decoratorIsForPropertiesOnly("sayHello")
        );

    });

    it("Should throw if not @mustBe annotations are present", () => {

        function shouldThrow() {

            class Person {
                public name: string;
                public sayHello() {
                    return "Hi!";
                }
            }

            validate(new Person());

        }

        expect(shouldThrow).to.throw(
            noMetadataWasFound("Person")
        );

    });

    it("Should throw if @mustBe as applied multiple times", () => {

        function shouldThrow() {

            class Person {
                @mustBe(a.string())
                @mustBe(a.string())
                public name: string;
                public sayHello() {
                    return "Hi!";
                }
            }

        }

        expect(shouldThrow).to.throw(
            decoratorCanOnlyBeAppliedOnce("name")
        );

    });

    it("Should be able to validate an object with a single property", () => {

        class User {
            @mustBe(a.string().alphanum().min(3).max(30).required())
            public username: string;
            public constructor(username: string) {
                this.username = username;
            }
        }

        const result1 = validate(new User(""));
        expect(result1.error.message).to.eql(
            `child "username" fails because ["username" is not allowed to be empty]`
        );

        const result2 = validate(
            new User("32njnjnefe894389h49nfu43nfn340hf934fn348nf3498341")
        );

        expect(result2.error.message).to.eql(
            `child "username" fails because ["username" length must ` +
            `be less than or equal to 30 characters long]`
        );

    });

    it("Should be able to validate an object with multiple properties", () => {

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

        const user1 = new User(
            "root",
            "secret",
            "token",
            1989,
            "test@test.com"
        );

        const result1 = validate(user1);
        expect(result1.error).to.eql(null);

        const user2 = new User(
            "root",
            "secret$",
            "token",
            1989,
            "test@test.com"
        );

        const result2 = validate(user2);
        expect(result2.error.message).to.eql(
            `child "password" fails because ["password" with value "secret$" ` +
            `fails to match the required pattern: /^[a-zA-Z0-9]{3,30}$/]`
        );

        const user3 = new User(
            "root",
            "secret",
            "token",
            1989,
            "test@@test.com"
        );

        const result3 = validate(user3);
        expect(result3.error.message).to.eql(
            `child "email" fails because ["email" must be a valid email]`
        );

    });

});
