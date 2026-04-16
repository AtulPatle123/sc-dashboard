#!/bin/sh
#
#         FILE: project.sh
#
#        USAGE: project.sh
#
#  DESCRIPTION: This file define current project name. 
#               It is substitued by Maven when the artifact is build from the archetype
#
#      OPTIONS: n/a
#
#        NOTES: 
#
#       AUTHOR: Serge Reboul
#     DIVISION: Building & IT Business (former Partner Business)
#      COMPANY: Schneider-Electric
#===============================================================================

export PROJECT_NAME=sc-sip-ui
export VERSION=\${project.version}
export BASE_VERSION=\${versionWithoutSnapshotSuffix}
