------------------------------------------------------------------------
This is the project README file. Here, you should describe your project.
Tell the reader (someone who does not know anything about this project)
all he/she needs to know. The comments should usually include at least:
------------------------------------------------------------------------

PROJECT TITLE:
PURPOSE OF PROJECT:
VERSION or DATE:
HOW TO START THIS PROJECT:
AUTHORS:
USER INSTRUCTIONS:

The Player registers with the GameController, which checks to see if the displayName is 
available.  If so, the player is created.

The GameController creates the Game, which in turn creates the required number of Round objects.
Each Round object creates the number of choices, and the probability distribution.

The GameController then presents a Round to the Player.  The player creates a Bet by choosing a 
choice and an amount to bet.  The Round then generates the winningChoice and updates the Bet
object accordingly.  The Player's 