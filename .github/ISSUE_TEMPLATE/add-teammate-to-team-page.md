---
name: Add teammate to team page
about: Gives directions for adding team member to page
title: Add self to team page
labels: enhancement
assignees: ''

---

Submit a pull request with a square jpg representing you (a photo, or an avatar of some sort; recommended resolution 1280x1280) in `img/team` and adding your info to `_data/team.yml` in this repo - that’ll show up (after a little delay) on https://www.distributedgenomics.ca/team.html .

You can copy (say) Matthew Wong's info block in `_data/team.yml` and change `team: alumni` to `team: implementation` (along with name, image name, etc).

There's no order to the people in `_data/team.yml` except that we try to keep it in three sections: current implementation team members (team: implementation), the PIs (team: leadership), and students, etc. who have moved on (team; alumni).

You can do this via standard git command tools if those are something you're used to, or via the webpage interface - that's described [here](https://candig.atlassian.net/wiki/spaces/CA/pages/52068353/How+to+add+yourself+to+the+teams+page).
