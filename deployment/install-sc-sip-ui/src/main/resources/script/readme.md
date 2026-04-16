# Project sc-sip-ui : script readme #

This folder store installation scripts used by ../install.sh and ../update.sh.

Note that this folder can be extended with additionnal and dedicated script but provided script must not be edited.
Each time the instal project will be built, those provided scripts will be overrided from the maven install-tool-archetype repository to ensure that script version are always up to date.
As a consequence, if you edit a provided script, your edition will be lost each time you build you project.
