export default class ErrorHandler extends Error {
  statusCode: number;
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;

    Error.captureStackTrace(this, this.constructor);
  }
}

{
  /** 
  ✅ Error (built-in class)

  new Error("Something went wrong");
  
  It gives you:

  {
  name: "Error",
  message: "Something went wrong",
  stack: "Error stack trace..."
}

creating new class extending inbuilt error...

class ErrorHandler extends Error
This means:

“I want my own custom error, based on default Error”

New things you added:
statusCode: number;

Now your error also has:
{
  message: "User not found",
  statusCode: 404
}

✅ 2. Custom constructor

constructor(statusCode: number, message: string)

Now you can do:

throw new ErrorHandler(404, "User not found");

✅ 3. super(message)
super(message);
👉 Calls parent (Error) constructor
So this sets:
this.message = message;
Without this → message won’t work ❌

🔹 3. What is Error.captureStackTrace?

What is stack trace?
When error happens:

function a() {
  b();
}

function b() {
  throw new Error("Oops");
}

a();

You get:

Error: Oops
  at b (...)
  at a (...)
This is stack trace

What your code does

Error.captureStackTrace(this, this.constructor); // Error.captureStackTrace(this, means ->ErrorHandler);

It tells Node.js:

When building the stack trace, skip this constructor (ErrorHandler) and start from where the error was actually thrown.”

❌ WITHOUT captureStackTrace

Stack trace might look like:

Error: User not found
    at new ErrorHandler (ErrorHandler.ts:5:10)  ❌ unwanted
    at getUser (userController.ts:10:5)
    at processRequest (...)

✅ WITH captureStackTrace

Error: User not found
    at getUser (userController.ts:10:5)   ✅ clean
    at processRequest (...)


    Directly shows where error happened
Hides constructor details
  
  */
}
