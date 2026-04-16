#!/bin/sh
################################################################################
#
#         FILE: install.sh
#
#        USAGE: install.sh ENV {-force|--force} {-ignore-checks|--ignore-checks}
#               install.sh -h
#
#  DESCRIPTION: This file exectute the application installation process
#               It is substitued by Maven when the artifact is build from the archetype
#
#               This script relies on project_files/bin/functions and script/*
#
#      OPTIONS: ENV                            : mandatorry  : Env targeted by the current installation. Value in ('dev*', 'ci*', 'sqe*', 'ppr*', 'prod*').
#               -force|--force                 : facultative : enforce installation on previously installed project.  This will delete ${PROJECT_HOME} before a complete reinstallation. 
#               -ignore-checks|--ignore-checks : facultative : this flag means that installation process does not want pre-requisite and post-installaton checks to be blocking
#
#        NOTES: 
#
#       AUTHOR: Serge Reboul
#     DIVISION: Building & IT Business (former Partner Business)
#      COMPANY: Schneider-Electric
#===============================================================================

# ============================================================================
# Load Function files
BASEDIR=$(dirname ${BASH_SOURCE[0]})
. ${BASEDIR}/script/functions
. ${BASEDIR}/project_files/bin/functions
. ${BASEDIR}/project.sh
assert_zero $? "Error while executing ${BASEDIR}/project.sh"

# Handle Help request
if [ "$1" == "-h" -o "$1" == "-help" ]; then
    echo "Usage : $0 (env) {-force}"
    echo "    env     : value in ('dev*', 'ci*', 'sqe*', 'ppr*', 'prod*')."
    echo "    -force : force clean and installation if product where previoulsy installed"
    exit 1
fi 

#-------------------------------------------------------------------------------
# Define install operation 
function install()
{
    #-------------------------------------------------------------------------------
    # Check input parameter and env variables
    export ENV=$1
    export LOG_PARAM=
    export IGNORE_CHECKS=
    for var in "$@"
    do
         if [[ "$var" == "-nolog" ]]; then
            export LOG_PARAM="-nolog"
         fi
         if [[ "$var" == "-ignore-checks" || "$var" == "--ignore-checks" ]]; then
            export IGNORE_CHECKS="-ignore-checks"
         fi
    done    
    
    if [ -z "${PROJECT_NAME}" ]; then
        error "Environment variable (PROJECT_NAME) is not defined. It should be defined within ${BASEDIR}/project.sh."
    fi
    if [[ "${ENV}" != dev* && "${ENV}" != ci* && "${ENV}" != sqe* && "${ENV}" != ppr* && "${ENV}" != prod* ]]; 
    then
        error "Parameter \$1 (ENV) is missing or not correct, value shall be in ('dev*', 'ci*', 'sqe*', 'ppr*', 'prod*'). Unable to proceed"
    fi 
    if [[ "${IGNORE_CHECKS}" == "-ignore-checks" ]];
    then
        if [[ "${ENV}" != dev* && "${ENV}" != ci* ]]; 
        then
            error "Can't ignore pre-requisite checks on env not in ('dev*' or 'ci*'. Unable to proceed"
        fi
    fi 

    log ${LOG_PARAM} "Installing application (${PROJECT_NAME}) on env (${ENV}) with flag=($*)"
    
    #-------------------------------------------------------------------------------
    # load properties
    log ${LOG_PARAM} "= -----------------------------------------------------------------"
    log ${LOG_PARAM} "= Build and Load properties from configuration files"
    . ${BASEDIR}/script/prepare_installation_env "${PROJECT_NAME}" $*
    assert_zero $? "Error retreive while building & loading properties with command : ${BASEDIR}/script/prepare_installation_env ${PROJECT_NAME} $*. Stopping the operation."

    chmod +x ${BASEDIR}/script/*
    chmod +x ${BASEDIR}/project_files/bin/*
    
    #-------------------------------------------------------------------------------
    # check pre-requisite
    log ${LOG_PARAM} "= -----------------------------------------------------------------"
    log ${LOG_PARAM} "= Check pre-requisite"
    ${BASEDIR}/project_files/bin/check_prerequisite -continue ${IGNORE_CHECKS}
    assert_zero $? "Prerequiste check ${BASEDIR}/project_files/bin/check_prerequisite is not ok. Stopping the operation."

	export WEBBUCKET_WEB_FOLDERS="sip/"
    #-------------------------------------------------------------------------------
    # install every application component
    log ${LOG_PARAM} "= -----------------------------------------------------------------"
    log ${LOG_PARAM} "= Execute script/install_all on project (${PROJECT_NAME}), env (${ENV})"
    BASEDIR=$(dirname ${BASH_SOURCE[0]})
    . ${BASEDIR}/script/install_all "${PROJECT_NAME}" $*
    assert_zero $? "Error while executing ${BASEDIR}/script/install_all"

    #-------------------------------------------------------------------------------
    # script can be leverage to add other specific component installation when any

    #-------------------------------------------------------------------------------
    # check post installation
    #log ${LOG_PARAM} "= -----------------------------------------------------------------"
    #log ${LOG_PARAM} "= Check post-installation"
   # if [ -x ${BIN_DIR}/check_postinstallation ]; then
      #  ${BIN_DIR}/check_postinstallation -continue ${IGNORE_CHECKS}
       # RC=$?
      #  if [ -x ${BIN_DIR}/dump_application_logs ]; then
       #     log ${LOG_PARAM} "=== Dumping out severs logs"
       #     ${BIN_DIR}/dump_application_logs
       # fi
     #   assert_zero $RC "Post installation checks ${BASEDIR}/project_files/bin/check_postinstallation is not ok."
    #elif [ -x ${BASEDIR}/project_files/bin/check_postinstallation ]; then
     #   ${BASEDIR}/project_files/bin/check_postinstallation -continue ${IGNORE_CHECKS}
      #  RC=$?
   # else
       # error "Impossible to access post-requisite check file ${BIN_DIR}/check_postinstallation or in ${BASEDIR}/project_files/bin/check_postinstallation"
    #fi
}

#-------------------------------------------------------------------------------
# Execute install operation and store output in log file 
DATE=DATE=`date +%Y-%m-%d-%H%M%S`
mkdir -p ${BASEDIR}/logs
assert_zero $? "Error while creating install and update logs dir in ${BASEDIR}/logs"

LOG_FILE=${BASEDIR}/logs/${PROJECT_NAME}.install.${DATE}
log "Creating update log file in ${LOG_FILE}"

install $* | tee -a ${LOG_FILE}
assert_zero ${PIPESTATUS[0]} "Error while installing project ${PROJECT_NAME}. See ${LOG_FILE} for more information"

log "++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++"
log "+ Install acheived without detected errors. See ${LOG_FILE} for more information"
log "++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++"
