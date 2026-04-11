# ==============================================================================
#
# Welcome in installer sc-sip-ui
#
# ==============================================================================

# Presenting CI Jobs
====================

Considering CI http://___ENTER_HERE_IP_FOR_CI___, few jobs have been generated and are described bellow : 

Build Jobs : 

* ___ENTER_LIST_FOR_BUILD_JOB___

The Build jobs do the following : 
1. checkout project from GIT master branch
2. build it via [ mvn clean install ], which usually does a npm install && bower install && grunt build on angulars projet and then zip the produced dist file prior building install tar.gz files.
3. push build artifact to artifactory http://10.155.34.21:8081/artifactory/dces-[release|snapshot]-local/
4. Extracted locally install tar.gz files and execute installation process based on env [ci], which push files to S3 bucket
To make that works, of course, we had to install AWS CLI on the Jenkins server, just as documented in the installation doc (which are generate withint the installation module)

Once deployed, server can be access within SE Network via : https://___ENTER_S3_INT_DNS_NAME___

Defaut TTL is set to 5 min but change shall be immediate as we don't have CF in this env

Deployment Jobs : 

* ___ENTER_LIST_FOR_DEPLOYMENT_JOB___

The Deployment jobs do the following : 
1. Request few parameter such as version to deploy and deployment mode
2. download or gather installation bundle previoulsy build based on parameter provided
3. Extracted locally install tar.gz files and execute installation process based on env [ENV], which push files to S3 bucket ([ENV] is a static parameter of the Jobs)
To make that works, of course, we had to copy jenkins public key in external server authorized key, as detailled here : https://schneider-electric-se.atlassian.net/wiki/display/DI/Jenkins+CI+-+Configure+SSH+Connexion+from+Jenkins+to+Servers

Defaut TTL is set to 5 min but change shall be immediate as we don't have CF in this env

You can create more jobs based no those exemple... but be aware that you must restrains and managed access control (otherwise, everyone will be able to push in Prod)



# Presenting the installation module
====================================

This installation module intends to automate and unify the way we build application release.
This is a maven module that can be called by its parent via simple mvn command such as :

   $ cd ${project-core-folder}
   $ mvn clean install

When execute succeed without error, installation modules generates 2 tar.gz files in install-sc-sip-ui\target\  :
  * sc-sip-ui-doc-1.1.0.tar.gz : which contains installation docs in IPO Style !
  * sc-sip-ui-release-1.1.0.tar.gz : which contains script and conf and binary to install applciation in VM

Ex : 
  * sc-sip-ui-doc-1.0-SNAPSHOT.tar.gz
  * sc-sip-ui-release-1.0-SNAPSHOT.tar.gz

When you want to use those tar.gz to install application on ${ENV}, you can read the doc.

Long story short,

As your project is a S3 delpoyment project,
1. Copy / extract sc-sip-ui-release-1.0-SNAPSHOT.tar.gz  somewhere and go in folder
2. Edit/view file conf/sc-sip-ui.${ENV}.properties to check if env related properties are ok
3. Execute ./install.sh ${ENV}
4. Wait for the process to finish


But once again, you should better refer to the doc which shall be more accurate than this readme file.

Key file in installation module are:  
- src\main\resources\install.sh and src\main\resources\update.sh
  Those are the core script. If you need to add extrat installation step, put them here !!!
  
- src\main\resources\conf\ 
  This contains every properties use in the tools. 
  Durnig the installation in env ENV, properties are used as var in scripts + they are sed-substitued in files  where you find bloc such as %%USER_NAME%% 
  You need one more Env related paramter, put it here... and then add you %%XXXX%% elsewhere

   
   - src\main\resources\script\ can contains installation used script. Note that omst of them are shared and will be push during the build as external depenecies
   - src\main\site\markdown\ contanis the md file that are use to build the pdf and html doc. If you want to be clean no doc (as we all love to), edit them

 Many information on this module can be foundbellow.
 Much more can even be found ehre : https://schneider-electric-se.atlassian.net/wiki/display/DI/DCES+Operating or https://schneider-electric-se.atlassian.net/wiki/display/DI/1.2+-+How-To+%3A+Install+the+Application+from+the+release



# Creating the installation module
==================================

Step 1 : Instantiate a instantiation module from archetype
----------------------------------------------------------

The process to create this installation module is straightforward
It must be executed via several command line on a server.

Let's assume that, on ${PROJECT_BASE_DIR}, you have a git clone for your project
Let's assume this project have a pom.xml file (if the project don't have one cause it go gradle or npm or bower or grunt, build one to call proper buils tools)
Let's assume ${PROJECT_BASE_DIR} is an empty parent which refernce child module with all the code of the project.

You can create a project with the following commands :

   $ cd ${PROJECT_BASE_DIR}
   $ # Define variable ${GROUP_ID}, ${APPLICATION_ID}, ${VERSION} and ${PROJECT_NAME}, based on the previous values
   $ GROUP_ID=com.schneider-electric.com.my-domaine
   $ APPLICATION_ID=my-project
   $ VERSION=1.0-SNAPSHOT
   $ PROJECT_NAME=my-project
   $ mvn archetype:generate -B -DgroupId=${GROUP_ID} -DartifactId=install-${APPLICATION_ID} -Dversion=${VERSION} -Dproject-name=${PROJECT_NAME} -DarchetypeGroupId=com.schneider-electric.dces -DarchetypeArtifactId=install-tool-configurable-archetype

This command create install-project_name folder with files to start building installation release.
This command also edit  PROJECT_BASE_DIR/pom.xml so that the parent maven project consider INSTALL-APPLICATION_ID as the last modules

Step 2 : Configure your new Install Project
-------------------------------------------

Once create, the project now need to be configure so that it can works.
This step is partially automated via a script that request configuration information.

If you execute this install module prior you configure it, you will receive this error message:

   $ cd install-my-project
   $ mvn clean install
   [...]
      #
   # Project com.schneider-electric.com.my-domaine:my-project is not properly configure
   # - To configure the project execute :
   #         mvn org.codehaus.groovy.maven:gmaven-plugin:execute@configure_install_project
   #
   # - To configure the project and generate httpd autosigned certificate execute :
   #         mvn org.apache.maven.plugins:maven-antrun-plugin:run@generate-httpd-certificates
   #
   #    [...]
   
   [INFO] ------------------------------------------------------------------------
   [INFO] BUILD FAILURE
   [INFO] ------------------------------------------------------------------------
   [INFO] Total time: 1.522 s
   [INFO] Finished at: 2016-05-10T15:24:47-01:00
   [INFO] Final Memory: 11M/495M
   [INFO] ------------------------------------------------------------------------
   [ERROR] Failed to execute goal org.apache.maven.plugins:maven-enforcer-plugin:1.4.1:enforce (enforce-project-properlly-configured) on project install-testinstall.1.1: Some Enforcer rules have failed. Look above for specific messages explaining why the rule failed. -> [Help 1]
   [ERROR]
   [ERROR] To see the full stack trace of the errors, re-run Maven with the -e switch.
   [ERROR] Re-run Maven using the -X switch to enable full debug logging.
   [ERROR]
   [ERROR] For more information about the errors and possible solutions, please read the following articles:
   [ERROR] [Help 1] http://cwiki.apache.org/confluence/display/MAVEN/MojoExecutionException


To configure the installation module do :

   $ cd install-my-project
   $ mvn org.codehaus.groovy.maven:gmaven-plugin:execute@configure_install_project
   [...]
   = Retrieve configuration information
   Choose Install configuration :
      0 : S3 Web Site
      1 : Tomcat 8 + Httpd Reverse Proxy + Java 1.8.0 Openjdk
      2 : Tomcat 8 + Httpd Reverse Proxy + Java 1.8.0 Oracle
      3 : Tomcat 7 + Httpd Reverse Proxy + Java 1.8.0 Openjdk
      4 : Tomcat 7 + Httpd Reverse Proxy + Java 1.8.0 Oracle
      5 : NodeJS 0.12 + Nginx Reverse Proxy
      6 : Httpd Web Site
      7 : All in!
      select [1] :

   Select Additionnal components :
      0 : nothing
      1 : MySQL 5.6
      2 : Mongo 3.2
      3 : All in!
   [...]
   [INFO] ------------------------------------------------------------------------
   [INFO] BUILD SUCCESS
   [INFO] ------------------------------------------------------------------------
   [INFO] Total time: 29.976 s
   [INFO] Finished at: 2016-04-28T10:59:03-01:00
   [INFO] Final Memory: 16M/495M
   [INFO] ------------------------------------------------------------------------

If you plan to use Httpd RP, then you also need to generate autosigned certificate via the following commands

   $ cd install-my-project
   $ mvn org.apache.maven.plugins:maven-antrun-plugin:run@generate-httpd-certificates
   [...]
   generate-httpd-certificates:
        [echo] Generate Certificate Key with fake password
        [exec] Generating RSA private key, 2048 bit long modulus
        [exec] ..............................+++
        [exec] ........
        [exec] ..........+++
        [exec] e is 65537 (0x10001)
        [echo] Removing fake password to Certificate Key
        [exec] writing RSA key
        [echo] Generate Certificate Server Request
        [echo] Generate autosigned Certificate
        [exec] Signature ok
        [exec] subject=/C=FR/ST=Hauts de Seine/L=Rueil Malmaison/O=Schneider Electric Industries SAS/OU=DCE/CN=my-project.autosigned.dces.schneider-electric.cn/emailAddress=global.dnsadmin@eud.schneider-electric.com
        [exec] Getting Private key
   [...]
   [INFO] ------------------------------------------------------------------------
   [INFO] BUILD SUCCESS
   [INFO] ------------------------------------------------------------------------
   [INFO] Total time: 3.434 s
   [INFO] Finished at: 2016-04-28T11:00:51-01:00
   [INFO] Final Memory: 17M/495M
   [INFO] ------------------------------------------------------------------------


Back to Step 1 : Oups, I did it wrong, How-to instantiate a instaooation module from archetype... again
-------------------------------------------------------------------------------------------------------

If you miss somethnig or made an error in the previous commands, you cannot replay it as is.
Before you re-execute, you must
- remove the newly created install-project_name folder
- edit the PROJECT_BASE_DIR /pom.xml to remove install-project_name  from the modules list

Then, you can retry to generate your project via Step 1 and Step 2

Step 3 : Execute your new Install Project
-----------------------------------------

Once create and configured, the project is ready to be used.
You now need to feed it with proper dependency, config and files.
So far, you shall be ready to execute it and generate -
If you execute this install module prior you configure it, you will receive this error message:

   $ cd install-my-project
   $ mvn clean install
   [...]
   [INFO] ------------------------------------------------------------------------
   [INFO] BUILD SUCCESS
   [INFO] ------------------------------------------------------------------------
   [INFO] Total time: 23.743 s
   [INFO] Finished at: 2016-04-28T11:04:30-01:00
   [INFO] Final Memory: 40M/495M
   [INFO] ------------------------------------------------------------------------


# Configure your installation module
====================================

1. Configure installation pom.xml
---------------------------------

You need to edit several element in the installation pom.xml
* Edit property artifactory.base.dir to set up the artifactory base release repository. Usually, value = http://10.155.34.21:8081/artifactory/dces-release-local/
* For each War or Zip dependencies to be embedded, extend pom.xm with project dependencies
      ..
      <!-- Add here dependencies to current project binaries -->
      <dependency>
        <groupId>MODULE_GROUP_ID</groupId>
        <artifactId>MODULE_ARCHETYPE_ID</artifactId>
        <version>${project.version}</version>
        <type>war</type>
      </dependency>
      <dependency>
        <groupId>MODULE_GROUP_ID</groupId>
        <artifactId>MODULE_ARCHETYPE_ID</artifactId>
        <version>X.Y-SNAPSHOT</version>
        <type>zip</type>
      </dependency>
      <!-- etc ... -->
      ..
   Note : During maven execution, dependent zip, war or jar dependency will be copied in target/binaries/ folder where assembly description will look for them.
   
2. Configure installation configuration files
---------------------------------------------

Installation configuration files are stored in \src\main\resources\conf\

Configuration file contains every parameter that are necessary to proceed to the installation and the update of the application.
Parameter defined in this file will be used for 2 usages :
   - Exported in Shell for script execution (Ex : export PROJECT_NAME=APPLICATION_ID)
   - Used to substitute value in 'text' file during every copy_and_substitute phases (Ex : replace %%PROJECT_NAME%% string in text file by APPLICATION_ID )

Note : Parameter in file can reference in value other parameter previously defined (Ex : PROJECT_HOME=/app/${PROJECT_NAME})
Each time you need to used a variable in a text file, this variable need to be reference in those configuration files.
Note that during installation or update, if the script find out one text file with embedded %%PARAM%%, if PARAM is not defined the installation or update process with fail and stop with an error.

Common configuration file that contains only parameter that are not environment-dependent. This file must not be edited during the installation process.
   PROJECT_NAME.properties contains common configuration parameters that are not related to the env and that must not be edited by Ops.

Environment specific configuration file that contains environment-dependent parameters. This file must be edited during the installation process.
   Possible value for environment are : prod, ppr, sqe, ci* and dev* (the last is optional)
   PROJECT_NAME.${ENV}.properties contains `${ENV}` specific parameter.
   
   Env file can create new parameter or overwrite varaibles defined in the common properties file
   Note that this file must not be directly changed by Ops, as described in the process bellow.

Important information on those configuration properties files :
   Every variable defined in Configuration Bloc are mandatorry. Installation will fail if they are deleted

3. Configure additionnal files
------------------------------

Depending on where you want the file to be installed, you need to whose in which dir to store it.

+-- install.sh
|   install.sh ensure the application installation.It automate as much as possible every operation that need to be achieved to install a new instance of<application>
|   This script reference script and function that are not in the Maven Project but that are in the install-tool-scripts, which is reference as a dependency.
| 
|   This file has to be completed if you need to proceed specif installation-from-scratch task.
|   Due to IPO requirement, note that this script shall not proceed any root based installation. 
|   Those root based installation have to be :
|   - defined as pre-requisite in the installation doc (for IPO related installation)
|   - be script within su/install* for DCES based installation
|   
+-- update.sh
|   update.sh update the application by deploying new applicative components on a previously installed server
|   This script reference script and function that are not in the Maven Project but that are in the install-tool-scripts, which is reference as a dependency. Missing scripts will be included in the tar.gz.
|  
|   This file has to be completed if you need to proceed specif update-mode-installation task.
|  
+-- project.sh
|   project.sh contains the application project name that will be used to create the application folder /app/<application>
|   This script must not be edited otherwise installation will not be correct.
|   
+-- conf
    conf/ folder contains properties files used during the installation or deployment process. See previous chapter.

+-- script
|
|   script/ folder contains scripts that can create or edited by the application.
|   Per default, all the script are retrieve and copied here during release packaging from a dedicated install-tool-scripts project
|   
+-- su
|
|   This folder can contains scripts install-* and files for automating every root operation.
|      On DCES environment, this script is execute prior to any installation to manage Root configuration, based on the other files.
|      On IPO environment, this script illustrate the list of pre-requisite operation requested to be handle as root and documented.
| 
+-- project_files
�   +-- bin
�   +-- start-application
�   +-- stop-application
�   +-- start-services
�   +-- stop-services
�   \-- etc...
�   +-- conf
�   +-- rc
�   +-- sql
�   \-- etc ...
�
|  Subfolder and file to be copied in application folder /app/<PROJECT_NAME>
|  Note, after the installation :
|     -> /app/<application>/bin/ contains scripts use for operating the server (start, stop, backup, etc ...)
|     -> Most of the script in /app/<application>/rc/ and  /app/<application>/bin/ will came from install-tool-scripts.
|     -> /app/<application>/rc/ contains the start/stop/restart/status script for the application servers
|     -> /app/<application>/conf/ contains every application configuration, resources and certificates files used by the Web Application.itself.
|        Note that no configuration file should be embedded in the WAR archive itself. They should all be exposed in this folder.
|        This folder can be referenced for the web application via a applicationContext.xml file stored in <WAR> and reference in the /WEB-INF/web.xml (see 1)
|     -> /app/<application>/mongo can contains mongo script to be executed on Mongo db (if any). 
|     -> /app/<application>/sql can contains sql script to be executed on MySQL db (if any). 
|  Note that there must not be any WAR or application dir in this folder. Those are to be found in tomcat_war
�
+-- tomcat_files
�   +-- rc
�   +-- tomcat
�   +-- tomcat7
�   +-- tomcat8
�   \-- etc ...
�
|   Subfolders and files to be copied in application folder /app/<application>
|   It agregates files attached to Tomcat installation
|   -> Recommended Installation folder for tomcat7 is tomcat
|   -> Recommended Installation folder for tomcat7 is tomcat
|   -> Alternative Installation folder can works...
|
+-- nodejs_files
�   +-- rc
�   \-- etc...
�
|   Subfolder and file to be copied in application folder /app/<application>
|   It agregates filse attached to NodeJs installation
|   
+-- collectd_files
�
|   Subfolder and file to be copied in CollectD folder in the server, usually /app/collectd
|
+-- httpd_files
�
|   Subfolder and file to be copied in HTTPD folder in the server via <application>-release-<version>/script/install_*_httpd, usually/app/httpd
�
+-- nginx_files
�
|   Subfolder and file to be copied in NGINX folder in the server via <application>-release-<version>/script/install_*_httpd, usually/app/httpd
�
\-- to be completed

4. Configure release notes and doc
----------------------------------

Installation tools autoamtically generate IPO-compliant installation pdf doc, based on markdown files store in doc file base dir.
- Doc files base dir is \src\site\
   Those markdown files need to be edited and modified to suit to your application installation process.
- Store everything back in SCM ... but INSTALL-APPLICATION_ID\target\
