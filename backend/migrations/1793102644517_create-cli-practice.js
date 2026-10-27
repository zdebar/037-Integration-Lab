export const up = (pgm) => {
  pgm.createTable("cli_practice", {
    id: {
      type: "serial",
      primaryKey: true,
    },
    label: {
      type: "text",
      notNull: true,
    },
    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });
};

export const down = (pgm) => {
  pgm.dropTable("cli_practice");
};
