At CanDIG, we work with lots of data in spreadsheet form. Many of our clinicians and data specialists expect to be able to share their data in Excel spreadsheets or similar, but these formats are less easily processed by scripts or for ingest into databases. For example, we often have to map datasets to internal data formats before they can be ingested into our system.

I often wish that I could convince my more spreadsheet-oriented colleagues to export their work into a format like CSV (comma-separated values), so that I don't have to download their files to my local machine just to take a peek at the latest version. It's hard to see what changes were made in the latest upload of a binary format like xlsx: GitHub (our source code repository of choice) doesn't display xlsx files in its web interface or allow you to compare versions. 

Ideally, then, our repositories would contain both xlsx files and their exported csv counterparts, so that both spreadsheet users and programmers could easily access their preferred format. However, asking users to manually update any changes to both formats before committing their files is both error-prone and possibly hard to maintain.

GitHub Actions are one possible solution to maintaining this consistency. While GitHub Actions are often used for maintaining development workflows, including integration, deployment, and testing, there's no reason that we can't use Actions to automatically trigger any other required scriptable activity. For example, we can use an Action to maintain the connection between a repository's xlsx files and their csv counterparts.

I created an action to do just that: https://github.com/CanDIG/xlsx2csv-action. Fundamentally, an Action is an executable, self-contained container that runs some code. The container will be executed by GitHub in an enclosing container, allowing each action's container to access the enclosing environment.The Action uses a manifest file to describe how its container will interact with the hosting container. With a GitHub Action, we can guarantee that we are executing in an environment with all of the required packages installed. Environment variables are defined to access inputs and the common workspace.

So, to begin creating this action, we write a simple Python script that performs the conversion on an inputted file. This Python file, at its most basic, uses the xlsx2csv package to convert xlsx files to csvs. We can do a little more than that: the script can walk through the repository's files (temporarily stored in the action's workspace) and convert all xlsx files it finds.

```
        dirlist = [args.input]
        files = []
        while len(dirlist) > 0:
            for (dirpath, dirnames, filenames) in os.walk(dirlist.pop()):
                dirlist.extend(dirnames)
                files.extend(map(lambda n: os.path.join(*n), zip([dirpath] * len(filenames), filenames)))
        for file in files:
            file_match = re.match("(.+)\.xlsx$", file)
            if file_match is not None:
                output_dir = f"{os.environ.get('GITHUB_WORKSPACE')}/{file_match.group(1)}"
                Xlsx2csv(file, outputencoding="utf-8").convert(output_dir, sheetid=0)
```

We can then wrap this in the standard shell script for GitHub Actions, entrypoint.sh:

```
#!/bin/sh

python /convert.py $*
```

And then execute that script from a Dockerfile:

```
FROM python:3.9

COPY . /

RUN pip install -r requirements.txt

ENTRYPOINT ["/entrypoint.sh"]
```

The nice thing about using Docker is that you can easily create a Docker environment on your local machine that replicates the environment that the Action will execute in. It'll look something like this docker-compose.yml:

```
version: '3.9'

services:
  action:
    build:
      context: .
    environment:
      GITHUB_WORKSPACE: "."
```

This is very convenient for testing: we can basically create and execute our container locally and be sure that everything runs:

```
$ docker-compose run action test.xlsx 
[+] Running 1/1
 ⠿ Network xlsx2csv-action_default  Created        0.1s
```

Now that we've tested the action locally, it's time to bring it into GitHub. There are two separate components referred to as Actions: the Action itself, which lives in its own repo and executes a simple scripted process in a hosted container, and the Workflow, which is the entity that is triggered by an event, creates a hosted container, and executes a series of Actions in sub-containers.

First, we define the Action in its own repository. This repo contains the code we wrote above, as well as an action.yml metadata file that defines how our Action's container fits into GitHub's workflow container stack. We define the inputs and outputs, as well as the environment this action runs in. Note that because we are using Docker, we can either create our own Dockerfile or use an existing base Docker image.

```
name: 'XLSX to CSVs'
description: "Convert an XLSX file's sheets to CSVs"
inputs:
  input_file:
    description: 'xlsx file or directory to convert'
    required: true
    default: 'test.xlsx'
runs:
  using: 'docker'
  image: 'Dockerfile'
  args:
    - ${{ inputs.input_file }}
```

This is a fairly minimal example of an action.yml file. More [syntax options](https://docs.github.com/en/actions/creating-actions/metadata-syntax-for-github-actions) are available.

Finally, to make the Action available to Workflows, we need commit and push the action to GitHub and then [make a named release](https://docs.github.com/en/articles/creating-releases). Now Workflows can call this action by referring to its `owner/action_name@release`. Note that it is possible to create the action within the repository that you want to run the workflow in, but if you want to make this Action discoverable to others by [publishing it in the GitHub Marketplace](https://docs.github.com/en/actions/creating-actions/publishing-actions-in-github-marketplace), you'll need to keep it in its own public repository.

We can now use this Action in a Workflow: for example, we want to convert all pushed xlsx files to csv files in a repository and then commit those changes. We'll define this in the repository in a yml file located in `.github/workflows/`. This metadata file defines the [triggering event](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows) and breaks down the series of jobs to be performed on that event. Each job defines the environment that the Actions will run in, then lists the actions to be taken, along with their inputs and outputs. Note here that we are using two other Actions that are from the GitHub Marketplace to do the checkout and commit steps, and that we can take advantage of the [environment variables](https://docs.github.com/en/actions/learn-github-actions/environment-variables) defined for the Workflow context.

```
on: [push]

jobs:
  convert-csvs:
    runs-on: ubuntu-latest
    name: Convert xlsx files to csvs
    steps:
      - name: Checkout
        uses: actions/checkout@v2
      - name: Convert to CSV
        uses: CanDIG/xlsx2csv-action@v2.0
        id: convert
        with:
          input_file: .
      - name: Commit changes
        uses: EndBug/add-and-commit@v4
        with:
          author_name: xlsx2csv bot
          message: "convert xlsx files to csvs"
          add: "*"
          ref: ${{env.GITHUB_REF}}
```

Once this workflow metadata file is pushed to GitHub, this workflow will be executed every time the triggering event occurs. Confusingly, you can see the workflow runs in the Actions tab of your repository, e.g. https://github.com/CanDIG/xlsx2csv-action/actions.

Personally, I found the distinction between creating Actions and creating Workflows that use the Actions to be somewhat blurred in [GitHub's documentation](https://docs.github.com/en/actions). I'd separate the documentation this way:

* [Creating Actions](https://docs.github.com/en/actions/creating-actions/about-custom-actions)
* [Creating Workflows](https://docs.github.com/en/actions/using-workflows/triggering-a-workflow)
* [Finding Actions to use in Workflows](https://docs.github.com/en/actions/learn-github-actions/finding-and-customizing-actions)
