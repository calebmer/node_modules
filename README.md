# node_modules
This is a monorepo for JavaScript packages that Caleb Meredith maintains. A monorepo is a single git repository, a single folder, which contains multiple modules. Instead of having a separate repository for each module Caleb publishes to npm, he instead opts for one. But why?

Remember the article [JavaScript fatigue](https://medium.com/@ericclemmons/48d4011b6fc4)? This is one solution. By putting every single module in one repository all of the build scripts, lint scripts, test scripts, release scripts only need to be written once. Starting a new module is as simple as calling a ”new” command. In addition putting everything in one place lowers the barrier to modification raising quality of all packages.

## Quality guarantee
As long as I am the maintainer of these modules I accept sole responsibility for these modules. Instead of depending on open source contributions I guarantee all modules in this repository will get bug fixes, security updates, and highly requested features in a timely manner. I also guarantee that all modules will (eventually) be well documented and strictly adhere to semantic versioning.

This guarantee uniquely applies to the modules in this repository as the barrier for modifying them is so low.

However, that said it might take me a week or so to get to the point where I can fix your issue or add your feature. In addition I might not see the value in your feature and refuse to add it. In that instance I encourage you to submit a pull request if you need timely changes. For more information on [pull request guidelines](#pull-request-guidelines), look a little down the page.

## Issue guidelines
I will try to get to your issue as soon as possible, but in order to help me help you please provide the following information:

- What module you have an issue/feature request for.
- What version of the module you are currently on.
- In the case of an error a small snippet of code which reproduces your error. This is important as I can put it in a test to ensure that your error will never happen again.

## Pull request guidelines
If you want to make a pull request, please adhere to the following:

- Only modify files in one module. Please don‘t change all of the modules or change the build scripts. If you feel something on a higher level then a module needs to be changed, tell me and I‘ll do it.
- Give a good reason your pull request should be merged with tangible impacts. I am accepting responsibility for all code that I merge in, I need there to be a good reason to maintain your code.
- Write tests. This is the key to writing a pull request that won‘t be regressed by someone else in the future.

## Developing in the monorepo
To develop a module first clone the repo (it‘s recommended you rename the folder from `node_modules`). Next switch into the directory of the module you want to work on. Finally (and this is really important) call `source .env`. What this does is it takes all of the scripts and makes them available to you as you develop.

```bash
$ git clone https://github.com/calebmer/node_modules.git calebmer_monorepo
$ cd calebmer_monorepo
$ npm install
$ cd {module-i-want-to-work-on}
$ source .env
```

### Development scripts
If you are in the module you want to develop and you have called `source .env`, you will have access to the following scripts:

- `$ build`: This runs babel and builds the module.
- `$ lint`: This lints your code to ensure it complies with the standard coding style.
- `$ test`: This runs the tests for your code.

Happy developing!

* * *

If you use and enjoy any of these modules you can show your thanks by following me, [`@calebmer`](https://twitter.com/calebmer), on Twitter.

Thanks and enjoy 👍
