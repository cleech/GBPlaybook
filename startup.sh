#!/usr/bin/bash
tmux new -d -s gb-playbook-dev \; split-window ;\
tmux send-keys -t gb-playbook-dev.0 "env -u HOST yarn preview" ENTER
tmux send-keys -t gb-playbook-dev.1 "firebase emulators:start" ENTER
tmux a -t gb-playbook-dev

