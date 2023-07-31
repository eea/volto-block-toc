# volto-block-toc

[![Releases](https://img.shields.io/github/v/release/eea/volto-block-toc)](https://github.com/eea/volto-block-toc/releases)

[![Pipeline](https://ci.eionet.europa.eu/buildStatus/icon?job=volto-addons%2Fvolto-block-toc%2Fmaster&subject=master)](https://ci.eionet.europa.eu/view/Github/job/volto-addons/job/volto-block-toc/job/master/display/redirect)
[![Lines of Code](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-block-toc-master&metric=ncloc)](https://sonarqube.eea.europa.eu/dashboard?id=volto-block-toc-master)
[![Coverage](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-block-toc-master&metric=coverage)](https://sonarqube.eea.europa.eu/dashboard?id=volto-block-toc-master)
[![Bugs](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-block-toc-master&metric=bugs)](https://sonarqube.eea.europa.eu/dashboard?id=volto-block-toc-master)
[![Duplicated Lines (%)](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-block-toc-master&metric=duplicated_lines_density)](https://sonarqube.eea.europa.eu/dashboard?id=volto-block-toc-master)

[![Pipeline](https://ci.eionet.europa.eu/buildStatus/icon?job=volto-addons%2Fvolto-block-toc%2Fdevelop&subject=develop)](https://ci.eionet.europa.eu/view/Github/job/volto-addons/job/volto-block-toc/job/develop/display/redirect)
[![Lines of Code](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-block-toc-develop&metric=ncloc)](https://sonarqube.eea.europa.eu/dashboard?id=volto-block-toc-develop)
[![Coverage](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-block-toc-develop&metric=coverage)](https://sonarqube.eea.europa.eu/dashboard?id=volto-block-toc-develop)
[![Bugs](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-block-toc-develop&metric=bugs)](https://sonarqube.eea.europa.eu/dashboard?id=volto-block-toc-develop)
[![Duplicated Lines (%)](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-block-toc-develop&metric=duplicated_lines_density)](https://sonarqube.eea.europa.eu/dashboard?id=volto-block-toc-develop)


[Volto](https://github.com/plone/volto) add-on

## Features

Demo GIF

## Getting started

### Try volto-block-toc with Docker

      git clone https://github.com/eea/volto-block-toc.git
      cd volto-block-toc
      make
      make start

Go to http://localhost:3000

### Add volto-block-toc to your Volto project

1. Make sure you have a [Plone backend](https://plone.org/download) up-and-running at http://localhost:8080/Plone

   ```Bash
   docker compose up backend
   ```

1. Start Volto frontend

* If you already have a volto project, just update `package.json`:

   ```JSON
   "addons": [
       "@eeacms/volto-block-toc"
   ],

   "dependencies": {
       "@eeacms/volto-block-toc": "*"
   }
   ```

* If not, create one:

   ```
   npm install -g yo @plone/generator-volto
   yo @plone/volto my-volto-project --canary --addon @eeacms/volto-block-toc
   cd my-volto-project
   ```

1. Install new add-ons and restart Volto:

   ```
   yarn
   yarn start
   ```

1. Go to http://localhost:3000

1. Happy editing!

## Release

See [RELEASE.md](https://github.com/eea/volto-block-toc/blob/master/RELEASE.md).

## How to contribute

See [DEVELOP.md](https://github.com/eea/volto-block-toc/blob/master/DEVELOP.md).

## Copyright and license

The Initial Owner of the Original Code is European Environment Agency (EEA).
All Rights Reserved.

See [LICENSE.md](https://github.com/eea/volto-block-toc/blob/master/LICENSE.md) for details.

## Funding

[European Environment Agency (EU)](http://eea.europa.eu)
