import { Knex } from "knex";
import * as models from "../../models";

export async function up(knex: Knex): Promise<void> {
  await models.createContestTable(knex);
  await models.createSellerTable(knex);
  await models.createCodeTable(knex);
  await models.createApplicationTable(knex);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("contests");
  await knex.schema.dropTable("codes");
  await knex.schema.dropTable("applications");
  await knex.schema.dropTable("sellers");
}
