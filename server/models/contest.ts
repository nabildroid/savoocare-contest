import * as Knex from "knex";

export async function createContestTable(knex: Knex.Knex) {
  const hasTable = await knex.schema.hasTable("contests");
  if (!hasTable) {
    await knex.schema.createTable("contests", (table) => {
      table.increments("id").primary();
      table.string("title").notNullable();
      table.string("title_ar").notNullable();
      table.date("start").notNullable();
      table.date("end").notNullable();
    });
  }
}

export type Contest = {
  id: string;
  title: string;
  title_ar: string;
  start: Date;
  end: Date;
};
