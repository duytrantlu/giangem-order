# 📚 Setel Order Service

 Main feature: Responsible for orders management.

# 🛠️ Prerequisites

- Environment required: NodeJS > 10.20

#### Non Docker

- Please make sure to either have MongoDB Community installed locally or a subscription to Mongo on the cloud by configuration a cluster in [atlas](https://www.mongodb.com/cloud/atlas). 

#### Docker 🐳

- Please make sure to have docker desktop setup on any preferred operating system to quickly compose the required dependencies. Then follow the docker procedure outlined below.

**Note**: Docker Desktop comes free on both Mac and Windows, but it only works with Windows 10 Pro. A workaround is to get [Docker Toolbox](https://docs.docker.com/toolbox/toolbox_install_windows/) which will bypass the Windows 10 Pro prerequisite by executing in a VM.

## Technical stack

- Technical programming:
  - *Language*: **NodeJS, Typescript**
  - *Framwork*: **NestJs**
  - Task-runner: **Gulp**
  - *Testing*: **Jest**
- Technical operation:
  - *Containerize*: all application containerize with **Docker**
  - *Orchestration*: **K8S**, Kops
  - *Package manager*: **Helm**
  - *CI/CD*: **Bitbucket pipeline**
  - *Cloud*: **AWS**

### 🚀 Deployment

You can launch applications with many different environment modes like:

- **Local**: running with local environment. Application mode running in port: **3000**

  ```shell
  # install: yarn
  # running: yarn start
  ```

### ✅ Testing

#### Docker 🐳

```bash
# unit tests
$ docker exec -it nest yarn test

# e2e tests
$ docker exec -it nest yarn test:e2e

# test coverage
$ docker exec -it nest yarn test:cov
```

#### Non-Docker

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

- For **staging** & **production** environments, you cannot run it on your local server. This is because configs for these environments are used under *configmap* and *secret* on our *K8S infrastructure*. Note that for staging environment you can access the document-api link that we have implemented below

  ```bash
  
  ```


## Release change

- Version 2020 list change:
  - Upgrade gulp V4 is compatibility version node >= 12
  - Lib (in src/libs) change all common variable is cammelCase

License

----
MIT

**VMO Global**

[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)

   [git-repo-url]: <https://github.com/joemccann/dillinger.git>
   [john gruber]: <http://daringfireball.net>
   [df1]: <http://daringfireball.net/projects/markdown/>
   [markdown-it]: <https://github.com/markdown-it/markdown-it>
   [Ace Editor]: <http://ace.ajax.org>
   [node.js]: <http://nodejs.org>
   [Twitter Bootstrap]: <http://twitter.github.com/bootstrap/>
   [jQuery]: <http://jquery.com>
   [@tjholowaychuk]: <http://twitter.com/tjholowaychuk>
   [express]: <http://expressjs.com>
   [AngularJS]: <http://angularjs.org>
   [Typescript]: <https://www.typescriptlang.org>
   [Gulp]: <http://gulpjs.com>
   [Swagger-Build]: <https://github.com/mohsen1/multi-file-swagger-example>
   [Docker]: <https://www.docker.com/>
