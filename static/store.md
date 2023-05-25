---
title: AoE Shapes
description: Draw AoE's per the D&D rules
author: David Severwright
image: https://owlbear-aoe.davidsev.co.uk/banner.png
icon: https://owlbear-aoe.davidsev.co.uk/icon.svg
tags:
    - tool
    - combat
    - drawing
manifest: https://owlbear-aoe.davidsev.co.uk/manifest.json
learn-more: https://github.com/davidsev/owlbear-aoe
---

# AoE Shapes

This extension draws AoE's and highlights which squares are hit per the rules in XGtE.

### Usage

The toolbar has three modes, for drawing cones, circles, and cubes. Click the icon and then click and drag to draw the
shape. \
By default it will highlight any square that is even partially covered by the shape, but you can change this in the
settings.

Owlbear doesn't currently allow extensions to change how shapes are edited, so the default rotation and scaling tools
are available but don't work correctly. \
If you want to rotate or scale a shape, you'll need to delete it and draw a new one. \

Currently only square grids are supported.

### Settings

The cog button opens the settings, which are set by the GM for the whole room. \
Currently the only setting is what percentage of a square needs to be covered to count as being hit by a cone. By RAW
any overlap is enough so it should be 0, however the default is 1 as setting it to zero can match some squares that
don't look like they should.

There aren't yet any settings for circles and squares.

The pencil button opens the style options, which are per-player.

### Rules

The rules for cubes are simple and non-controversial.\
Circles are done on 50% coverage, per DMG 251.\
Cones are where everyone has a different opinion. I've gone with the "template" rules
in [XGtE 67/68](https://www.dndbeyond.com/sources/xgte/dungeon-masters-tools#Spellcasting), as
the [DMG rules](https://www.dndbeyond.com/sources/dmg/running-the-game#AreasofEffect) are so vague as to be useless.\
[Jeremy Crawford tweeted](https://twitter.com/JeremyECrawford/status/774037607097311232) that any overlap is enough, but
it's configurable as not everyone agrees with that.

Basically, we draw a triangle and every square that is covered by more than the configured percentage of the triangle is
hit. \
I'm pretty sure this is the "correct" way, if you disagree please send references with your complaints.

### Other

- The code is on [GitHub](https://github.com/davidsev/owlbear-aoe)
- You can post issues there, and stuck questions / feature requests in the discussion there.
- There's a thread on the Owlbear Discord: https://discord.com/channels/795808973743194152/1107014504660881458

