#! /bin/sh
FRAMEWORK=/usr/palm/frameworks
TESTRUNNER=$FRAMEWORK/unittest/version/1.0/tools/test_runner.js
NODE_ADDONS=/usr/palm/nodejs
FRAMEWORKS_PATH=/usr/palm/frameworks:/usr/palm/frameworks/private
export NODE_PATH="$FRAMEWORKS_PATH:$NODE_ADDONS"

node $TESTRUNNER -- test/all_tests.json
