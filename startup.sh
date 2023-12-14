#!/usr/bin/bash
tmux new -d -s gb-playbook-dev \; split-window ;\
tmux send-keys -t gb-playbook-dev.0 "env -u HOST yarn dev" ENTER
tmux send-keys -t gb-playbook-dev.1 "yarn run firebase emulators:start" ENTER
tmux a -t gb-playbook-dev

