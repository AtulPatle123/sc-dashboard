# Project sc-sip-ui : project_files/bin readme #

This folder stores every script that will be used to operate the application.

During installation or update, those will be properly substituted to retreive env-related parameters internally used.

Note that this folder can be extended with additionnal and dedicated script but provided script must not be edited.
Each time the instal project will be built, those provided scripts will be overrided from the maven install-tool-archetype repository to ensure that script version are always up to date.
As a consequence, if you edit a provided script, your edition will be lost each time you build you project.



