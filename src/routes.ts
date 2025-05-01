import type { RouteConfig } from "@react-router/dev/routes";

export default [
  {
    path: "/",
    file: "./routes/root.tsx"
  },
  {
    file: "./routes/app-layout.tsx",
    children: [
      {
        path: "game",
        file: "./routes/game.tsx",
        children: [
          {
            index: true,
            file: "./routes/game.index.tsx",
          },
          {
            path: "draft",
            file: "./routes/game.draft.tsx",
          },
          {
            path: "draft/play",
            file: "./routes/game.play.tsx",
          },
        ],
      },
      {
        path: "library",
        file: "./routes/library.tsx",
        children: [
          {
            index: true,
            file: "./routes/library.index.tsx",
          },
          {
            path: "gameplans",
            file: "./routes/library.gameplans.tsx",
          },
          {
            path: "refcards",
            file: "./routes/library.refcards.tsx",
          },
          {
            path: ":guild",
            file: "./routes/library.guild.tsx",
          },
        ]
      },
      {
        path: "print",
        file: "./routes/print.tsx",
      },
      {
        path: "settings",
        file: "./routes/settings.tsx",
      },
    ],
  },
] satisfies RouteConfig;
