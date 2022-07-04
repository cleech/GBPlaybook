import { types } from "mobx-state-tree";

/* keep track of navigation sub-stacks */

const RouteStack = types.model({
    history: types.array(types.string)
}).actions(self => ({
    push(route: string) {
        self.history.push(route);
    },
    pop() {
        return self.history.pop();
    }
}));

export const Nav = types.model({
    gameplayRoute: types.array(types.string),
    libraryRoute: types.array(types.string),
});
