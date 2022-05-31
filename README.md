# Just Commit Performance Workout and Maxes Tracker

## Commands

This bot has a few example commands which can be modified as needed.

### Help Command

A `/help` command to get help on different areas of the bot, like commands or permissions:

### Info Command

A `/info` command to get information about the bot, links to different resources, or developer information.

### Test Command

A generic command, `/test`, which can be copied to create additional commands.

### Welcome Message

A welcome message is sent to the server and owner when the bot is added.

## Start Scripts

You can run the bot in multiple modes:

1. Normal Mode
    - Type `npm start`.
    - Starts a single instance of the bot.
2. Manager Mode
    - Type `npm run start:manager`.
    - Starts a shard manager which will spawn multiple bot shards.
3. PM2 Mode
    - Type `npm run start:pm2`.
    - Similar to Manager Mode but uses [PM2](https://pm2.keymetrics.io/) to manage processes.
