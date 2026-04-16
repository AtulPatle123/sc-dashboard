# Project sc-sip-ui : conf readme #

This folder store installation configuration files.

Configuration file contains every parameter that are necessary to proceed to the installation and the update of the application.

> Parameter defined in this file will be used for 2 usages :
    * Exported in Shell for script execution (Ex : export PROJECT_NAME=sc-sip-ui )
    * Used to susbtitute value in 'text' file during every copy_and_substitute phases (Ex : replace %%PROJECT_NAME%% string in text file by 'sc-dashboard-ui' )

> Note : Parameter in file can reference in value other parameter previously defined (Ex : PROJECT_HOME=/app/${PROJECT_NAME})


For every installation on environnement (ENV), 3 files are used to defined the list of parameter with relevant value

1. conf/sc-sip-ui.properties contains common configuration parameter that are not Env related.
> This file agreggate every shared and common parameter and it must not be edited prior to installation phase

2. conf/sc-sip-ui.(ENV).properties contains (Env) specific parameter.
> This file contains parameter that need to be edited for every enviornement prior to the installation installation phase

3. ${CONFIGURATION_DIR}/sc-sip-ui.(ENV).properties contains (Env) specific parameter.
> This file contains env specifc or confidential parameter that will deiti by Ops teams once for all
> In Prod of Pre-Prod, the file is mandatorry. Elsewhere, it is just optional.

Those 3 files behavie like layer where file N can override value define on file N-1 (or bellow).

Note : (Env) values are in ('dev', 'ci', 'sqe', 'ppr', 'prod')


