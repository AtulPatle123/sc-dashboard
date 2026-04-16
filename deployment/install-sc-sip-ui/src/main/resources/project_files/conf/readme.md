# Project sc-sip-ui : project_files/conf readme #

This folder stores every configuration file used by the current application.
Note that no used configuration file should be embedded in WAR or Web Folders itself. They should all be exposed and centralized in this folder.
    * On Tomcat, this folder can be referenced for the web application via a applicationContext.xml file stored in <WAR> and reference in the /WEB-INF/web.xml

During installation or update, those will be properly substituted to retreive env-related parameters internally used.
