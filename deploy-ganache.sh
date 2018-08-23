#!/usr/bin/env bash
darq-truffle compile
darq-truffle migrate --network enigma
darq-truffle test --network enigma
