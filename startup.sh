#!/usr/bin/bash
tmux new -d -s gb-playbook-dev \; split-window ;\
tmux send-keys -t gb-playbook-dev.0 "env -u HOST yarn dev --host" ENTER
tmux send-keys -t gb-playbook-dev.1 "cd server && bun dev" ENTER
tmux a -t gb-playbook-dev

