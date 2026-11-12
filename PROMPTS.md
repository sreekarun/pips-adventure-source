# Prompts Used to Build "Anamika's Adventure"

This game was built with Claude Code (Claude Opus 5.5). Anamika (age 9) came up with the game ideas, and a parent set up the project and watched.

Below is every prompt, in order. Each one is copied exactly as it was typed or spoken, including spelling. When Claude asked a multiple-choice question, the choice that was picked is shown below the question. The **Result** line names the git checkpoint (commit) made after that step.

---

## Part 1: Project setup (parent)

### Prompt 1: `/init`
*(The Claude Code command that creates a `CLAUDE.md` file. The folder was still empty at this point.)*

### Prompt 2
> Anamika, she is 9, wants to create a mario like game. As parent I am able to assist her but she should be driving the requirements through prompt updates. You should prepare the project such that its easy for her to update, and iterate. The app can use react and it should be visually pleasant. Use ai generated kid safe assets for making it interesting.  Setup a local git repository and claude.md. Ask clarifying questions to be about the setup and inital app and prepare questions that you would ask her.

Claude asked these questions, and the parent picked:

| Question | Answer |
| --- | --- |
| Where should the game art come from? | Claude-drawn SVG |
| What will Anamika play on? | Both (computer keyboard and touch screen) |
| How will she give her ideas to Claude? | She types, I watch |
| How should the game engine work? | Small custom engine |

**Result:** `5351cb7` First version: Pip the cat in Sunny Meadow

---

## Part 2: Anamika's ideas
*(Anamika spoke most of these prompts out loud using Claude Code's `/voice` dictation.)*

### Prompt 3: Make your own hero
> For making our own character or hero, can it be in a way that you can make your own, like, character? Like, there could be at the beginning, you can design it with, like, you can click, like, a button, and then you can, like, color it using, like, the colors, or, like, it's like you have to paint your avatar, like, character thing. And then, so can we be able to do that?

| Question | Answer |
| --- | --- |
| How do you want to make your hero? | Both! (color in a hero AND paint pixels) |

**Result:** `c0c7163` Make your own hero: color in Pip or paint a pixel hero

### Prompt 4: See the game
> show me the current version

*(Claude opened the game in the browser.)*

### Prompt 5: 3D look, treasure boxes and costumes
> Can you make it like not too Mario, but like, can you make it in a way that you can look at different angles? And you know, like that treasure box, can it be like you can make, so like, it's like a custom avatar that it's like related to something, maybe like a movie or something. If you get a treasure box, or it can be like 10 coins or something in different time. Sometimes there could be nothing.

| Question | Answer |
| --- | --- |
| What do you mean by "look at different angles"? | 3D look, same game |
| Which costumes do you want? (Claude explained that real movie characters belong to other people, so it would make original costumes inspired by them.) | 🚀 Space explorer, 🏴‍☠️ Pirate, 🧙 Wizard, 🧜 Mermaid / Ocean |

### Prompt 6: The puppy hero
*(Typed while Claude was still working on Prompt 5.)*
> But once you get an idea, before you do everything, can you like, you know how it said like type your answer? Without type your answer, can I make like a cute like tiny white-ish tan dog with black, like on the end of their ears black?

**Result:** `f29e1b5` New hero: a tiny tan puppy with black ear tips
**Result (Prompt 5):** `8c9b8d6` 3D world, surprise treasure chests, and costumes to find

### Prompt 7: Levels, coins, and the champion choices
> So can you make like a different level, like you spend points you can on like different levels? And then so then you can spend coins to get another level, and then once you finish all the levels you get a bunch of coins, and then you have 3 decisions to either to restart the game, be able to take you'll have the admin, or you can spectate the other players while they're playing.

| Question | Answer |
| --- | --- |
| Which new worlds should the levels be? | ❄️ Snowy mountains, 🍭 Candy land, 🌊 Under the sea, 🚀 Outer space |
| What should Admin let you do? | Both! (super powers AND a level builder) |
| Who should you be able to spectate? | Computer players |

**Result:** `cf86e9d` 4 new worlds, coin bank to unlock them, champion prize, admin powers, level builder, and spectate

### Prompt 8: A world for her school
> Add one more world for abbots hill elementry school https://abbottshill.fultonschools.org/our-school

*(Claude read the school's public web page to get the mascot, colors and motto.)*

**Result:** `62ba193` New world: Abbotts Hill Elementary, home of the Jaguars

### Prompt 9: School first
> Make school as the first world

**Result:** `ed9120a` School is the first world now

### Prompt 10: This list
> Write down all the prompts used so far. it is required for project submission

---

## How to see each step
Every **Result** is a save point. To look at the game as it was after any step, open a terminal in this folder and run the command below, replacing `c0c7163` with the code you want. Then run `npm run dev`.

```bash
git checkout c0c7163
```

Run `git checkout main` to come back to the newest version. To list every save point, run `git log --oneline`.
