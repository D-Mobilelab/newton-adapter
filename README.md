# JS Boilerplate

This is the boilerplate for your new javascript project.

## Create new library

Before all, you have to create a new library. 

To make this, read the instructions reported [here](https://github.com/D-Mobilelab/dml-js-generator/blob/master/README.md#generate-a-new-library)

## Instructions for your new library



### Grunt command list

When your library is ready, you can use the following grunt commands:

<table>
  <tr>
    <th>Command</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>grunt lint</td>
    <td>Run es-lint to check that code respects the style guide. Single run task.</td>
  </tr>
  <tr>
    <td>grunt test</td>
    <td>Run unit test. Single run task.</td>
  </tr>
  <tr>
    <td>grunt coverage</td>
    <td>Run unit test, calculate coverage, run a local server to display the coverage report and wait. When a file is changed (in "example", "src" or "test" folder), the test re-run and the server is reloaded. <br/><i>P.S. to read coverage, open "lcov-report" folder in browser.</i></td>
  </tr>
  <tr>
    <td>grunt docx</td>
    <td>Create temporary documentation, run a local server to display it and wait. When a file is changed (in "modules" folder), the documentation is re-created and the server is reloaded.</td>
  </tr>
  <tr>
    <td>grunt serve</td>
    <td>Run a local server on "example" folder. When a file is changed (in "example" or "src" folder), the server is reloaded.</td>
  </tr>
  <tr>
    <td>grunt travis</td>
    <td>Create a new build, run unit test, calculate coverage, send coverage to coveralls, run es-lint and create a temporary documentation. (This command can be executed only on Travis; it's useful to check if build is successful).</td>
  </tr>
  <tr>
    <td>grunt version</td>
    <td>Create a new build, run unit test, calculate coverage, run es-lint, create a new version (major, minor or patch), create a new official documentation.</td>
  </tr>
</table>



### How to create a new feature

We use [Git flow](http://nvie.com/posts/a-successful-git-branching-model/) to create a new feature or make an hotfix.

- Create a new feature branch from "develop" branch
```
git checkout develop
git checkout -b feature/newfeature
```
- Code!
- Commit and push on feature branch
- When the feature is ready, merge feature branch on "develop", resolving possible conflicts
- Delete local and remote feature branch, after merge
```
git branch -d feature/newfeature
git push origin :feature/newfeature
```
- When a new version of your_library is ready to be created, read the section below



### How to create a new version

- When the "develop" branch contains new features ready for production, create a new pull request from develop to master branch
- Check the code with other developers and when you are ready, merge!
- On "master" branch use this grunt command
```
grunt version
```
- We use [Semantic Versioning](http://semver.org/) to create a new version
- You can choose between a major version, a minor version or a patch
```
? Current: 1.1.0 - Choose a new version for this library: (Use arrow keys)
❯ No new version 
  Major Version (2.0.0) 
  Minor Version (1.2.0) 
  Patch (1.1.1)
```
- Describe the features of this new version, seperating them with semicolons
```
? Features for version 1.1.0 (use ";" to separate features): ()
```
- Commit and push *CHANGELOG* and *bower.json*
```
git commit -a -m "New feature"
git push origin master
```
- Create a new git tag with the name of new version and push this
```
git tag 2.0.0
git push --tags origin
```
- Push new documentation
```
git subtree push --prefix docs origin gh-pages
```
- The new version is ready!



### How to read documentation

To read documentation of your library, open 

http://d-mobilelab.github.io/(yourlibrary)/temp  **replacing temp with version number**. 

For example, for version 1.0.0, open

http://d-mobilelab.github.io/(yourlibrary)/1.0.0 
