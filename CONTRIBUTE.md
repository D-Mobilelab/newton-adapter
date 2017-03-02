# Contribute

## GULP Commands

To execute a GULP task

    gulp <task> <arguments>

<table>
    <th>
        <td>task</td>
        <td>description of task</td>
        <td>possible arguments</td>
    </th>
    <tr>
        <td><b>eslint</b></td>
        <td>Run ESLint on source file</td>
        <td>-</td>
    </tr>
    <tr>
        <td><b>test</b></td>
        <td>Run unit test</td>
        <td><i>--watch</i>: run a local server on converage report</td>
    </tr>
    <tr>
        <td><b>coveralls</b></td>
        <td>Pass coverage report to coveralls (use it on Travis)</td>
        <td>-</td>
    </tr>
    <tr>
        <td><b>webpack</b></td>
        <td>Create dist file with webpack</td>
        <td><i>--version</i>: create a specified version of the dist file (i.e. --version=2.0.0)</td>
    </tr>
    <tr>
        <td><b>doc</b></td>
        <td>Create documentation</td>
        <td>
            <i>--version</i>: create a specified version of the documentation (i.e. --version=2.0.0)<br/>
            <i>--watch</i>: run a local server on new documentation<br/>
        </td>
    </tr>
    <tr>
        <td><b>build</b></td>
        <td>Create complete build: run eslint and test, make documentation and make dist file</td>
        <td>
            <i>--version</i>: create a specified version (i.e. --version=2.0.0)<br/>
            <i>--watch</i>: run a local server on examples<br/>
        </td>
    </tr>
</table>

## Create a new version

1. Run <i>gulp build --version=x.y.z</i>, replacing x.y.z with new version
2. Replace version field on package.json
3. Add description of new version on CHANGELOG file
4. Commit and push on master branch
5. Create tag with version name with <i>git tag x.y.z && git push origin --tags</i>
6. Push documentation with this command <i>git subtree push --prefix docs origin gh-pages<i>
7. Execute <i>npm publish</i> to update npm package