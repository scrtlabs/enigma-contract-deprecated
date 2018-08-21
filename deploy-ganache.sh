#!/usr/bin/env bash
rm -rf build
darq-truffle compile
darq-truffle migrate --network $1
darq-truffle test --network $1
