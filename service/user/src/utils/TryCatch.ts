import { Request, Response, NextFunction, RequestHandler } from "express";
import ErrorHandler from "./errorHandler.js";

export const TryCatch = (
  controller: (req: Request, res: Response, next: NextFunction) => Promise<any>,
): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await controller(req, res, next);
    } catch (error) {
      if (error instanceof ErrorHandler) {
        return res.status(error.statusCode).json({ message: error.message });
      }

      res.status(500).json({ message: (error as Error).message });
    }
  };
};

{
  /** 
  
  (----------

  🔁 Big Idea First

            TryCatch is a function that returns another function.

            First call → you pass your controller (myFun)
            Second call → Express automatically calls the returned function with (req, res, next)

            👉 You do NOT manually call the returned function — Express does it

      Code Simplified

      const TryCatch = (controller) => {
          return async (req, res, next) => {
            try {
              await controller(req, res, next);
            } catch (error) {
              // error handling
            }
          };
        };

        Step-by-Step Flow

        1. You define a controller

        const myFun = async (req, res, next) => {
          res.json({ message: "Hello World" });
        };

        2. You pass it into TryCatch

        app.get("/test", TryCatch(myFun));

        What happens here?

        👉 TryCatch(myFun) runs immediately

        So internally:

        const wrappedFunction = TryCatch(myFun);

        Now wrappedFunction becomes:
                  async (req, res, next) => {
            try {
              await myFun(req, res, next);
            } catch (error) {
              ...
            }
          }

          3. Express stores this function

            Now Express has:

            app.get("/test", wrappedFunction);

            4. When request comes → Express calls it

            When user hits /test, Express does:
            wrappedFunction(req, res, next);

            Step 1:
                    TryCatch(myFun)

                    Step 2:
                    returns → (req, res, next) => { ... }

                    Step 3:
                    Express stores it

                    Step 4:
                    Request comes →

                    Express calls:
                    (req, res, next)

                    Step 5:
                    Inside:
                    controller(req, res, next) → myFun(req, res, next)

                    🧪 Example With Console Logs
                                          const myFun = async (req, res, next) => {
                                                console.log("Inside controller");
                                                res.send("OK");
                                              };

                                              const TryCatch = (controller) => {
                                                console.log("TryCatch called");

                                                return async (req, res, next) => {
                                                  console.log("Returned function called");

                                                  try {
                                                    await controller(req, res, next);
                                                  } catch (error) {
                                                    console.log("Error caught");
                                                  }
                                                };
                                              };

                                              app.get("/test", TryCatch(myFun));

                                              🖥️ Output Flow

                                                    When server starts:

                                                    TryCatch called

                                                    When hitting /test:

                                                    Returned function called
                                                    Inside controller

                          
  ---------)
  
  
  1. What is Request, Response, NextFunction?
    📥 Example INPUT (client request)
    GET /user/1
    Express converts it into:
        req = {
      params: { id: "1" },
      body: {},
      query: {}
    }
      ----

      📤 Response example
      res.status(200).json({ name: "Prajwal" });
      Client gets:
            {
        "name": "Prajwal"
      }

      ------

      🔁 next
      next()
      passes control to next middleware

      ------

      2. What is controller?

      NOT inbuilt — your custom function

      Example controller:

              const getUser = async (req: Request, res: Response) => {
          const user = null;

          if (!user) {
            throw new ErrorHandler(404, "User not found");
          }

          res.json(user);
        };

        What it expects
        (req, res, next) => Promise

        What it returns
            Usually sends response using res
            OR throws error
     -------

           3. What is TryCatch doing?
              It wraps your controller

              Without TryCatch ❌
                    app.get("/user", async (req, res) => {
                      const user = null;
                      if (!user) throw new Error("User not found");
                    });
                    💥 Server crashes if error not handled

              With TryCatch ✅
                  app.get("/user", TryCatch(getUser));

                  🔁 FLOW (VERY IMPORTANT)
                  Client Request → Express → TryCatch wrapper → controller runs

                    IF success:
                      → controller sends response

                    IF error:
                      → catch block handles it

          4. What does it RETURN?

             (): RequestHandler => { ... }
             It returns:
             (req, res, next) => { ... }
             This is what Express expects

          5. await controller(req, res, next)

            👉 Calls your controller

            Example flow
            await controller(req, res, next);

            If controller throws:
            throw new ErrorHandler(404, "User not found");

            goes to catch

          6. instanceof explained
          eerror instanceof ErrorHandler

          Checks:

          “Was this error created using ErrorHandler class?”

          Example
          const err = new ErrorHandler(404, "Not found");
          console.log(err instanceof ErrorHandler); // true

          const err = new Error("Oops");
          console.log(err instanceof ErrorHandler); // false

          
  */
}
